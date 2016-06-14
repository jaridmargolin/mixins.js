/*!
 * mixer.js
 */




/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var _ = require('underscore');
var decorate = require('underscore-companion/decorate');


/* -----------------------------------------------------------------------------
 * Mixer
 * ---------------------------------------------------------------------------*/

/**
 * @public
 * @constructor
 * @memberof mixins
 *
 * @name Mixer
 * @desc Object merger with automatic collision handling.
 *
 * @param {Object} Obj - Object to add mixins to.
 * @param {Array} mixins - Array of mixins to apply.
 */
var Mixer = function (Obj, mixins) {
  // allows mixing into the constructor's prototype or the dynamic instance
  this.Obj = Obj;
  this.obj = this.Obj.prototype || this.Obj;
  this.mixins = mixins || [];
  this.collisions = {};

  _.each(this.mixins, this.mixin, this);
  _.each(this.collisions, this.createComposite, this);
};

/**
 * @public
 * @memberof Mixer
 *
 * @desc Get mixin and loop over individual properties and merge.
 *
 * @param {Object|string} - Object to merge into Obj.
 */
Mixer.prototype.mixin = function (mixin) {
  _.each(mixin, this.merge, this);
};

/**
 * @private
 * @memberof Mixer
 *
 * @desc Merge value of mixin property with the value of the corresponding
 * `obj` property.
 *
 * @param {*} val - Property value
 * @param {string} key - Property name (key).
 */
Mixer.prototype.merge = function (val, key) {
  if (key in this.obj && !val.__mixin) {
    return;

  } else if (!(key in this.obj) || val.__mixin === 'clobber') {
    this.obj[key] = val;

  } else if (_.isFunction(val)) {
    this.mergeFunction(val, key);

  } else if (_.isArray(val)) {
    this.mergeArray(val, key);

  } else if (_.isObject(val)) {
    this.mergeObject(val, key);
  }
};

/**
 * @private
 * @memberof Mixer
 *
 * @desc Merge function values. Add mixin value to collisions obj.
 *
 * @param {*} val - Property value
 * @param {string} key - Property name (key).
 */
Mixer.prototype.mergeFunction = function (val, key) {
  var isObjMethod = this.obj[key] === val;
  var isColMethod = _.contains(this.collisions[key], val);
  var hasCol = this.collisions.hasOwnProperty(key);

  // If the mixer already has that exact function reference
  if (isObjMethod || isColMethod) {
    return;
  }

  // avoid accessing built-in properties like constructor
  this.collisions[key] = hasCol ? this.collisions[key] : [this.obj[key]];
  this.collisions[key].push(val);
};

/**
 * @private
 * @memberof Mixer
 *
 * @desc Merge array values using `append`, `prepend`, or `union`.
 *
 * @param {*} val - Property value
 * @param {string} key - Property name (key).
 */
Mixer.prototype.mergeArray = function (val, key) {
  if (val.__mixin === 'append') {
    this.obj[key] = this.obj[key].concat(val);
  } else if (val.__mixin === 'prepend') {
    this.obj[key] = val.concat(this.obj[key]);
  } else if (val.__mixin === 'union') {
    this.obj[key] = _.union(this.obj[key], val);
  }
};

/**
 * @private
 * @memberof Mixer
 *
 * @desc Merge object properties using `extend` or `defaults`.
 *
 * @param {*} val - Property value
 * @param {string} key - Property name (key).
 */
Mixer.prototype.mergeObject = function (val, key) {
  if (val.__mixin === 'extend') {
    this.obj[key] = _.extend(this.obj[key], val);
  } else if (val.__mixin === 'defaults') {
    this.obj[key] = _.defaults(this.obj[key], val);
  }
};

/**
 * @private
 * @memberof Mixer
 *
 * @desc Create a composite function which calls each collision value in the order
 * it was added. The return value of the composite function will be the last
 * undefined val.
 *
 * @param {Array} collisions - Array of fns to compose.
 * @param {string} name - Property name (key).
 */
Mixer.prototype.createComposite = function (collisions, key) {
  var originalFn = this.obj[key];

  if (key === 'constructor') {
    var parent = this.Obj;
    this.Obj = this.composeFn(collisions, originalFn);
    this.Obj.prototype = this.obj;
    this.Obj.prototype.constructor = this.Obj;
    _.extend(this.Obj, parent);
  } else {
    this.obj[key] = this.composeFn(collisions, originalFn);
  }
};

/**
 * @private
 * @memberof Mixer
 *
 * @desc Returns a composed function which will call all collision methods as
 * well as the original.
 *
 * @param {Object} collisions - Collided methods to call in composed function.
 * @param {Function} originalFn - The original fn that was collided against.
 */
Mixer.prototype.composeFn = function (collisions, originalFn) {
  return function () {
    var callFnGroup = _.bind(function (group, args) {
      return _.reduce(group, function (returns, fn) {
        var returned = fn.apply(this, args);
        return typeof returned === 'undefined' ? returns : returned;
      }, undefined, this);
    }, this);

    var decorators = _.where(collisions, { __mixin: 'decorate' });
    return decorate(decorators, function () {
      var args = arguments;
      var before = _.where(collisions, { __mixin: 'before' });
      var beforeReturn = callFnGroup(before.reverse(), args);
      var originalReturn = originalFn.apply(this, args);
      var after = _.where(collisions, { __mixin: 'after' });
      var afterReturn = callFnGroup(after, args);

      if (!_.isUndefined(afterReturn)) {
        return afterReturn;
      } else if (!_.isUndefined(originalReturn)) {
        return originalReturn;
      } else if (!_.isUndefined(beforeReturn)) {
        return beforeReturn;
      }
    }).apply(this, arguments);
  };
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = Mixer;


