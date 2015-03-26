/*!
 * test/_umd.js
 * 
 * Copyright (c) 2014
 */

define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var assert = require('proclaim');
var mixins = require('mixins/mixins');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('umd - mixins.js', function () {

  it('Should expose mixin method.', function () {
    assert.isFunction(mixins.mixin);
  });

  it('Should expose globals object.', function () {
    assert.isObject(mixins.globals);
  });

  it('Should expose Mixin Class.', function () {
    assert.isFunction(mixins.Mixin);
  });

});


});