/*!
 * mixin.js
 */




/* -----------------------------------------------------------------------------
 * mixin
 * helper fn used to create mixins.js compatible mixins.
 * ---------------------------------------------------------------------------*/

/**
 * @public
 * @memberof mixins
 *
 * @desc Method to attach mixin meta data to objects. This meta data is used
 * by the mixer in order to determine how to merge the given object.
 *
 * @example
 * var myMixin = {
 *   ui: mixins.mixin('defaults', { $btn: '.default-btn' })
 * };
 *
 * @param {string} type - The mixin type to attach to the object
 * @param {Object|Array|Function} obj - The object which will be merged.
 */
var mixin = function (type, obj) {
  Object.defineProperty(obj, '__mixin', { enumerable: false, writable: true });
  obj.__mixin = type;

  return obj;
};


/* -----------------------------------------------------------------------------
 * expose
 * ---------------------------------------------------------------------------*/

module.exports = mixin;



