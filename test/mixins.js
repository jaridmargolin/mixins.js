/*!
 * test/mixins.js
 */

define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var assert = require('proclaim');
var sinon  = require('sinon');
var mixins = require('mixins');

// mixins shortcuts
var mixin = mixins.mixin;


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('mixins.js', function () {

  it('Should expose mix method.', function () {
    assert.isFunction(mixins.mix);
  });

  it('Should expose mixin method.', function () {
    assert.isFunction(mixins.mixin);
  });

  it('Should expose Mixer Class.', function () {
    assert.isFunction(mixins.Mixer);
  });


  /* ---------------------------------------------------------------------------
   * mix
   * -------------------------------------------------------------------------*/

  describe('mix', function () {

    beforeEach(function () {
      this.Obj = {};
      this.m1  = {};
      this.m2  = {};

      this.mixinStub = sinon.spy(mixins, 'Mixer');

      this.result = mixins.mix(this.Obj, this.m1, this.m2);
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

  });


  /* ---------------------------------------------------------------------------
   * merge objects
   * -------------------------------------------------------------------------*/

  describe('merge objects', function () {

    it('Should get clobbered by default.', function () {
      var Obj = {
        prop: { key: 'val1' }
      };

      var Mixed = mixins.mix(Obj, {
        prop: { key: 'val2' }
      });

      assert.equal(Mixed.prop.key, 'val1');
    });

    it('Should extend the object.', function () {
      var Obj = {
        prop: { key: 'val1' }
      };

      var Mixed = mixins.mix(Obj, {
        prop: mixin('extend', { key: 'val2' })
      }, {
        prop: mixin('extend', { key: 'val3' })
      });

      assert.equal(Mixed.prop.key, 'val3');
    });

    it('Should use the object as defaults.', function () {
      var Obj = {
        prop: { key: 'val1' }
      };

      var Mixed = mixins.mix(Obj, {
        prop: mixin('defaults', { key: 'val2', key2: 'val2' })
      }, {
        prop: mixin('defaults', { key: 'val3', key2: 'val3' })
      });

      assert.equal(Mixed.prop.key, 'val1');
      assert.equal(Mixed.prop.key2, 'val2');
    });

  });


  /* ---------------------------------------------------------------------------
   * merge arrays
   * -------------------------------------------------------------------------*/

  describe('merge arrays', function () {

    it('Should get clobbered by default.', function () {
      var Obj = {
        prop: [1]
      };

      var Mixed = mixins.mix(Obj, {
        prop: [2]
      });

      assert.deepEqual(Mixed.prop, [1]);
    });

    it('Should prepend array values.', function () {
      var Obj = {
        prop: [1]
      };

      var Mixed = mixins.mix(Obj, {
        prop: mixin('prepend', [2])
      }, {
        prop: mixin('prepend', [3])
      });

      assert.deepEqual(Mixed.prop, [3, 2, 1]);
    });

    it('Should append array values.', function () {
      var Obj = {
        prop: [1]
      };

      var Mixed = mixins.mix(Obj, {
        prop: mixin('append', [2])
      }, {
        prop: mixin('append', [3])
      });

      assert.deepEqual(Mixed.prop, [1, 2, 3]);
    });

    it('Should merge array returning only unique values (union).', function () {
      var Obj = {
        prop: [1]
      };

      var Mixed = mixins.mix(Obj, {
        prop: mixin('union', [1])
      }, {
        prop: mixin('union', [2])
      });

      assert.deepEqual(Mixed.prop, [1, 2]);
    });

  });


  /* ---------------------------------------------------------------------------
   * merge methods
   * -------------------------------------------------------------------------*/

  describe('merge methods', function () {

    it('Should get clobbered by default.', function () {
      var result = [];
      var Obj = {
        method: function () { result.push(1); }
      };

      var Mixed = mixins.mix(Obj, {
        method: function () { result.push(2); }
      });

      Mixed.method();
      assert.deepEqual(result, [1]);
    });

    it('Should compose fns before the original fn.', function () {
      var result = [];
      var Obj = {
        method: function () { result.push(1); }
      };

      var Mixed = mixins.mix(Obj, {
        method: mixin('before', function () { result.push(2); })
      }, {
        method: mixin('before', function () { result.push(3); })
      });

      Mixed.method();
      assert.deepEqual(result, [3, 2, 1]);
    });

    it('Should compse fns after the original fn.', function () {
      var result = [];
      var Obj = {
        method: function () { result.push(1); }
      };

      var Mixed = mixins.mix(Obj, {
        method: mixin('after', function () { result.push(2); })
      }, {
        method: mixin('after', function () { result.push(3); })
      });

      Mixed.method();
      assert.deepEqual(result, [1, 2, 3]);
    });

    it('Should return the last returned value.', function () {
      var result = [];
      var Obj = {
        method: function () { return 1; }
      };

      var Mixed = mixins.mix(Obj, {
        method: mixin('before', function () { return 2; })
      }, {
        method: mixin('after', function () { return 3; })
      }, {
        method: mixin('before', function () { return 4; })
      });

      assert.equal(Mixed.method(), 3);
    });

    it('Should compose constructor function.', function () {
      var result = [];
      var Obj = function () { result.push(1); };
      Obj.prototype.method = function () {};

      var Mixed = mixins.mix(Obj, {
        constructor: mixin('before', function () { result.push(2); })
      }, {
        constructor: mixin('after', function () { result.push(3); })
      }, {
        constructor: mixin('before', function () { result.push(4); })
      });

      var mixed = new Mixed();
      assert.deepEqual(result, [4, 2, 1, 3]);
      assert.isFunction(mixed.method);
    });

  });

});


});