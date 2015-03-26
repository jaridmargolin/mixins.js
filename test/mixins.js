/*!
 * test/mixins.js
 * 
 * Copyright (c) 2014
 */

define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var assert = require('proclaim');
var sinon  = require('sinon');
var mixins = require('mixins');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('mixins.js', function () {

  it('Should expose mixin method.', function () {
    assert.isFunction(mixins.mixin);
  });

  it('Should expose globals object.', function () {
    assert.isObject(mixins.globals);
  });

  it('Should expose Mixin Class.', function () {
    assert.isFunction(mixins.Mixin);
  });


  /* ---------------------------------------------------------------------------
   * mixin
   * -------------------------------------------------------------------------*/

  describe('mixin', function () {

    beforeEach(function () {
      this.Obj = {};
      this.m1  = {};
      this.m2  = {};

      this.mixinStub = sinon.spy(mixins, 'Mixin');

      this.result = mixins.mixin(this.Obj, this.m1, this.m2);
    });

    afterEach(function () {
      this.mixinStub.restore();
    });

    it('Should pass base Obj.', function () {
      assert.isTrue(this.mixinStub.calledWith(this.Obj));
    });

    it('Should pass mixins array.', function () {
      var args = this.mixinStub.args[0];
      assert.deepEqual(args[1], [this.m1, this.m2]);
    });

    it('Should pass globals object.', function () {
      assert.isTrue(this.mixinStub.calledWith(mixins.globals));
    });

  });

});


});