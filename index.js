var ValidatorChain = require('validator-chain');

/**
 * An object validator
 * @constructor
 */
function ObjectValidator() {

  if (!(this instanceof ObjectValidator)) {
    return new ObjectValidator();
  }

  this._optional    = false;
  this._validators  = {};
}

ObjectValidator.prototype = {

  /**
   * Get/Set whether an object is optional
   * @param   {bool|function():bool}                  [optional]
   * @returns {bool|ObjectValidator}
   */
  optional: function(optional) {
    if (arguments.length) {
      this._optional = optional;
      return this;
    } else {
      return this._optional;
    }
  },

  /**
   * Set a validator on a property
   * @param   {string}                                type        The property type e.g. "fn" or "prop"
   * @param   {string}                                property    The property name
   * @param   {function(*):bool|Array|ValidatorChain} validator   The property validator
   */
  add: function(type, property, validator) {

    //convert the validator to a chain if it isn't already
    if (!(validator instanceof ValidatorChain)) {
      var chain = new ValidatorChain();

      if (typeof(validator) === 'function') {
        chain.add(validator)
      } else if (Array.isArray(validator)) {
        for (var i=0; i<validator.length; ++i) {
          chain.add.apply(chain, validator[i]);
        }
      } else {
        throw new Error('Invalid validator');
      }

      validator = chain;
    }

    //add the validator
    this._validators[property] = {
      type:       type,
      validator:  validator
    };

    return this;
  },

  /**
   * Set a validator on a function property
   * @param   {string}                                property    The property name
   * @param   {function(*):bool|Array|ValidatorChain} validator   The property validator
   * @returns {ObjectValidator}
   */
  fn: function(property, validator) { //TODO: accept a property path
    return this.add('fn', property, validator);
  },

  /**
   * Set a validator on a non-function property
   * @param   {string}                                property    The property name
   * @param   {function(*):bool|Array|ValidatorChain} validator   The property validator
   * @returns {ObjectValidator}
   */
  prop: function(property, validator) { //TODO: accept a property path
    return this.add('prop', property, validator);
  },

  /**
   * Validate the object
   * @param   {Object}                                object
   * @param   {function(Error, bool, Object)}         callback
   * @returns {ObjectValidator}
   */
  validate: function(object, callback) {

    var
      self        = this,
      valid       = true,
      messages    = {},
      finished    = 0,
      properties  = Object.keys(this._validators)
    ;

    //check if the value is optional and doesn't need validating
    var optional = this._optional;
    if (typeof(optional) === 'function') {
      optional = optional();
    }
    if (object === null || typeof(object) !== 'object') {

      if (optional) {
        callback(null, true, {});
      } else {
        callback(new Error('Expected an object to validate'));
      }

      return this;
    }

    //check if we're finished and only ever call the callback *once* if we are
    function done(error) {

      //check if we need to end cause of an error
      if (error) {
        finished = properties.length;
        return callback(error);
      }

      //check if we need to end cause finished
      ++finished;
      if (finished === properties.length) {
        callback(null, valid, messages);
      }

    }

    //run each property validation
    properties.forEach(function(property) {
      var rule = self._validators[property];

      //get the value - even from a getter function
      var value = object[property];

      //get the value from a function
      if (rule.type === 'fn') {
        if (typeof(value) === 'function') {
          value = value();
        } else {
          return done(new Error('Expected property "'+property+'" to be a function.'));
        }
      }

      //validate the value
      rule.validator.validate(value, function(propError, propValid, propContext) {

        valid = valid && propValid;

        if (propContext) {
          messages[property] = propContext;
        }

        done(propError);
      });

    });

    return this;
  }

};

module.exports = ObjectValidator;