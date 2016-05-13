/*!
 * test/_amd.js
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

describe('amd - mixins.js', function () {

  it('Should expose mix method.', function () {
    assert.isFunction(mixins.mix);
  });

  it('Should expose mixin method.', function () {
    assert.isFunction(mixins.mixin);
  });

  it('Should expose Mixer Class.', function () {
    assert.isFunction(mixins.Mixer);
  });

});


});