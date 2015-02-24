var assert = require('assert');
var ObjectValidator = require.loader === 'component' ? require('object-validator') : require('..');

describe('ObjectValidator', function() {

  describe('.validate()', function() {

    it('should return an error when the object is not an object and validation is not optional', function(done) {
      ObjectValidator()
        .validate(null, function(error, valid, messages) {
          assert(error instanceof Error);
          assert.equal(valid, undefined);
          assert.equal(messages, undefined);
          done();
        })
      ;
    });

    it('should not return an error when the object is not an object and validation is optional', function(done) {
      ObjectValidator()
        .optional(true)
        .validate(null, function(error, valid, messages) {
          assert(!(error instanceof Error));
          assert.equal(valid, true);
          assert.deepEqual(messages, {});
          done();
        })
      ;
    });

    it('should return an error on a method when the property is not a method', function(done) {
      ObjectValidator()
        .fn('getName', function(value) {
          assert.equal('John');
          return true;
        })
        .validate({getName: 'John'}, function(error, valid, messages) {
          assert(error instanceof Error);
          assert.equal(valid, undefined);
          assert.equal(messages, undefined);
          done();
        })
      ;
    });

    it('should return valid on a method when the property is a method', function(done) {
      ObjectValidator()
        .fn('getName', function(value) {
          assert.equal(value, 'John');
          return true;
        })
        .validate({getName: function() {return 'John'}}, function(error, valid, messages) {
          assert(!(error instanceof Error));
          assert.equal(valid, true);
          assert.deepEqual(messages, {});
          done();
        })
      ;
    });

    it('should return valid on a property', function(done) {
      ObjectValidator()
        .prop('name', function(value) {
          assert.equal(value, 'John');
          return true;
        })
        .validate({name: 'John'}, function(error, valid, messages) {
          assert(!(error instanceof Error));
          assert.equal(valid, true);
          assert.deepEqual(messages, {});
          done();
        })
      ;
    });

    it('should return invalid on a property', function(done) {
      ObjectValidator()
        .prop('name', function(value) {
          assert.equal(value, 'John');
          return false;
        })
        .validate({name: 'John'}, function(error, valid, messages) {
          assert(!(error instanceof Error));
          assert.equal(valid, false);
          assert.deepEqual(messages, {});
          done();
        })
      ;
    });

    it('should return a context when a property is invalid', function(done) {
      ObjectValidator()
        .prop('name', [
          [function(value) {return false;}, 'Error!']
        ])
        .validate({name: 'John'}, function(error, valid, messages) {
          assert(!(error instanceof Error));
          assert.equal(valid, false);
          assert.deepEqual(messages, {name: 'Error!'});
          done();
        })
      ;
    });

    it('should return valid when there are no validators', function(done) {
      ObjectValidator()
        .validate({name: 'John'}, function(error, valid, messages) {
          assert(!(error instanceof Error));
          assert.equal(valid, true);
          assert.deepEqual(messages, {});
          done();
        })
      ;
    });

  });

});