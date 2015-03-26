/*!
 * test/mixin.js
 * 
 * Copyright (c) 2014
 */

define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var _      = require('underscore');
var assert = require('proclaim');
var sinon  = require('sinon');
var Mixin  = require('mixin');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('mixin.js', function () {

  beforeEach(function () {
    // allows us to see the execution order of methods
    var order = this.order = [];
    var orderedStub = function (val, returns) {
      return sinon.spy(function () { 
        order.push(val);
        return returns;
      });
    };

    this.objMethod = orderedStub(0, 0);

    this.m1 = { mtd: orderedStub(1, 1), arr: [1], obj: { prop1: 1 }, num: 1 };
    this.m2 = { mtd: orderedStub(2), arr: [0, 2], obj: { prop: 2, prop2: 2 }, num2: 2  };

    this.mixins  = [this.m1, 'm2'];
    this.globals = { 'm2': this.m2 };

    this.Obj = function () {};
    this.Obj.prototype.mtd = this.objMethod;
    this.Obj.prototype.obj = { prop: 0 };
    this.Obj.prototype.arr = [0];
    this.Obj.prototype.num = 0;

    this.mixin  = new Mixin(this.Obj, this.mixins, this.globals);
    this.instance = new this.Obj();
    this.result = this.instance.mtd();
  });


  /* ---------------------------------------------------------------------------
   * merge methods
   * -------------------------------------------------------------------------*/

  describe('merging methods', function () {

    it('Should fire all colliding methods in the order they were added.', function () {
      assert.isTrue(this.objMethod.calledOnce);
      assert.isTrue(this.m1.mtd.calledOnce);
      assert.isTrue(this.m2.mtd.calledOnce);
      assert.deepEqual(this.order, [0, 1, 2]);
    });

    it('Should return the last undefined return value.', function () {
      assert.equal(this.result, '1');
    });

    it('Should not mixin the same method more than once.', function () {
      var fn = sinon.stub();
      var m1 = { mtd: fn };
      var m2 = { mtd: fn };
      var obj = {};

      var mixin = new Mixin(obj, [m1, m2]);
      obj.mtd();

      assert.isTrue(fn.calledOnce);
    });

  });


  /* ---------------------------------------------------------------------------
   * merge arrays
   * -------------------------------------------------------------------------*/

  describe('merging arrays', function () {

    it('Should add values together when value is an array.', function () {
      assert.deepEqual(this.instance.arr, [0, 1, 2]);
    });

  });


  /* ---------------------------------------------------------------------------
   * merge objects
   * -------------------------------------------------------------------------*/

  describe('merging objects', function () {

    it('Should merge properties when value is a hash.', function () {
      assert.equal(this.instance.obj.prop1, 1);
      assert.equal(this.instance.obj.prop2, 2);
    });

    it('Should prioritize instance properties when value is a hash.', function () {
      assert.equal(this.instance.obj.prop, 0);
    });

  });

  /* ---------------------------------------------------------------------------
   * merge primatives
   * -------------------------------------------------------------------------*/

  describe('merging primatives', function () {

    it('Should prioritize class property over mixin property', function () {
      assert.equal(this.instance.num, 0);
      assert.equal(this.instance.num2, 2);
    });

  });


  /* ---------------------------------------------------------------------------
   * integrated
   * -------------------------------------------------------------------------*/

  it('Should allow mixing after the subclass has been instantiated.', function () {
    var instance = new this.Obj();
    var mixin = new Mixin(instance, this.mixins, this.globals);

    // assert primative value added
    assert.equal(this.instance.num2, 2);
  });

});


});