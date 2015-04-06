/*!
 * mixins.js
 * 
 * Copyright (c) 2014
 */

define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var _     = require('underscore');
var Mixin = require('./mixin');


/* -----------------------------------------------------------------------------
 * mixins
 * ---------------------------------------------------------------------------*/

return {

  globals : {},
  Mixin   : Mixin,

  /**
   * Merge objects while automatically handling collisions.
   *
   * @param {Object} Obj - Object to add mixins to.
   */
  mixin: function (Obj) {
    var mix = _.chain(arguments).toArray().rest().flatten().value();
    var mixin  = new this.Mixin(Obj, mix, this.globals);

    return Obj;
  }

};


});