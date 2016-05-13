/*!
 * mixins.js
 */




/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var _ = require('underscore');
var Mixer = require('./mixer');
var mixin = require('./mixin');

/* -----------------------------------------------------------------------------
 * mixins
 * ---------------------------------------------------------------------------*/

/**
 * @global
 * @public
 * @namespace mixins
 *
 * @desc Utilities to mix objects with fine grain collision handling control.
 */
module.exports = {

  Mixer: Mixer,
  mixin: mixin,

  /**
   * @public
   * @memberof mixins
   *
   * @desc Merge objects while automatically handling collisions.
   *
   * @example
   * var myObject = {
   *   ui: {
   *     '$btn': '.obj-btn'
   *   },
   *   method: function () {}
   * };
   *
   * var myMixin = {
   *   ui: mixins.mixin('defaults', {
   *     '$btn': '.default-btn',
   *     '$input': '.default-input'
   *   })
   * };
   *
   * mixins.mix(myObject, myMixin);
   * // MyObject.ui === {
   * //   '$btn': '.obj-btn', 
   * //   '$input': '.default-input'
   * // }
   *
   * @param {Object} Obj - Object to add mixins to.
   * @param {Array} mixins - Array of mixins to apply.
   */
  mix: function (Obj, mixins) {
    var mix = _.chain(arguments).toArray().rest().flatten().value();
    var mixin  = new this.Mixer(Obj, mix);

    return mixin.Obj;
  }

};


