/*!
 * mixin.js
 * 
 * Copyright (c) 2014
 */




/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var _ = require('underscore');


/* -----------------------------------------------------------------------------
 * Mixin
 * ---------------------------------------------------------------------------*/

/**
 * Object merger with automatic collision handling.
 *
 * @param {Object} Obj - Base Obj in which to mixin properties.
 * @param {Array} mixins - Array of objects to mixin to base Obj.
 * @param {Object} globals - Optional map of global mixins that can be
 *   referenced by key name in the mixins Array.
 */
var Mixin = function (Obj, mixins, globals) {
  // allows mixing into the constructor's prototype or the dynamic instance
  this.obj        = Obj.prototype || Obj;
  this.mixins     = mixins || [];
  this.globals    = globals || {};
  this.collisions = {};

  _.each(this.mixins, this.mixin, this);
  _.each(this.collisions, this.createComposite, this);
};

/**
 * Get mixin and loop over individual properties and merge.
 *
 * @param {Object|string} - If an `Object` is passed, its properties will be
 *   merged. If a `string` is passed it will lookup the object in globals
 *   and merge the resulting proprties.
 */
Mixin.prototype.mixin = function (mixin) {
  // allow mapping to globally defined mixins via defined key name
  if (_.isString(mixin)) {
    mixin = this.globals[mixin];
  }

  // merge each property in the mixin
  _.each(mixin, this.merge, this);
};

/**
 * Merge value of mixin property with the value of the corresponding
 * `obj` property.
 *
 * @param {*} val - Property value
 * @param {string} key - Property name (key).
 */
Mixin.prototype.merge = function (val, key) {
  if (_.isFunction(val)) {
    this.mergeFunction(val, key);

  } else if (_.isArray(val)) {
    this.mergeArray(val, key);

  } else if (_.isObject(val)) {
    this.mergeObject(val, key);

  } else if (!(key in this.obj)) {
    this.obj[key] = val;
  }
};

/**
 * Merge function values. Add mixin value to collisions obj.
 *
 * @param {*} val - Property value
 * @param {string} key - Property name (key).
 */
Mixin.prototype.mergeFunction = function (val, key) {
  var isObjMethod = this.obj[key] === val;
  var isColMethod = _.contains(this.collisions[key], val);

  // If the mixer already has that exact function reference
  if (isObjMethod || isColMethod) {
    return;
  }

  if (this.obj[key]) {
    // avoid accessing built-in properties like constructor
    this.collisions[key] = this.collisions.hasOwnProperty(key) ? this.collisions[key] : [this.obj[key]];
    this.collisions[key].push(val);
  }

  this.obj[key] = val;
};

/**
 * Merge array values.
 *
 * @param {*} val - Property value
 * @param {string} key - Property name (key).
 */
Mixin.prototype.mergeArray = function (val, key) {
  this.obj[key] = _.union(this.obj[key] || [], val);
};

/**
 * Merge object properties using extend.
 *
 * @param {*} val - Property value
 * @param {string} key - Property name (key).
 */
Mixin.prototype.mergeObject = function (val, key) {
  this.obj[key] = _.extend({}, val, this.obj[key] || {});
};

/**
 * Create a composite function which calls each collision value in the order
 * it was added. The return value of the composite function will be the last
 * undefined val.
 *
 * @param {Array} vals - Array of property values.
 * @param {string} name - Property name (key).
 */
Mixin.prototype.createComposite = function (vals, name) {
  this.obj[name] = function () {
    var args = arguments;

    return _.reduce(vals, function (returns, val) {
      var returned = _.isFunction(val) ? val.apply(this, args) : val;
      return typeof returned === 'undefined' ? returns : returned;
    }, null, this);
  };
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = Mixin;


