# object-validator

Validate properties on an object.

## Installation

    component install digitaledgeit/js-object-validator

## Usage

    var ObjectValidator = require('object-validator');

    function isNotEmpty(value) {
      return value !== undefined && value !== null && value !== '' && value.length !== [];
    }

    function isInArray(array) {
      return function(value) {
        return array.indexOf(value) !== -1;
      };
    }

    function isBool(value) {
      return typeof(value) === 'boolean';
    }

    function isTrue(value) {
      return value === true;
    }

    var address = {
      getStreet:    function() {return '15 Make Believe St';},
      getSuburb:    function() {return 'Newcastle';},
      getPostcode:  function() {return '2300';},
      getState:     function() {return 'NSW';},
      matched:        true,
      location: {
        lat: 33.333,
        lng: 11.111
      }
    };

    ObjectValidator()
      .optional(true)
      .fn('getStreet',   [[isNotEmpty, 'Street cannot be empty']])
      .fn('getSuburb',   [[isNotEmpty, 'Suburb cannot be empty']])
      .fn('getPostcode', [[isNotEmpty, 'Postcode cannot be empty']])
      .fn('getState',    [
        [isNotEmpty, 'State cannot be empty'],
        [isInArray(['NSW', 'QLD', 'VIC', 'ACT', 'NT', 'TAS', 'SA', 'WA']), 'Invalid state']
      ])
      .prop('matched', [
        [isNotEmpty, 'Partial must be defined'],
        [isBool, 'Partial must be a bool'],
        [isTrue, 'Partial must be true']
      ])
      .prop('location.lat', [
        [isNotEmpty, 'Latitude cannot be empty'],
        [function(value) {return value > 33}, 'Wrong part of the world']
      ])
      .prop('location.lng', [
        [isNotEmpty, 'Longitude cannot be empty'],
        [function(value) {return value > 11}, 'Wrong part of the world']
      ])
      .validate(address, function(error, valid, messages) {
        console.log('validated: ', error, valid, messages)
      })
    ;

## API

### new ObjectValidator()

Create a new validator.

### .optional(optional)

    /**
     * Get or set whether an object is optional
     * @param   {bool|function():bool}                  [optional]
     * @returns {bool|ObjectValidator}
     */

### .fn(property, validator)

    /**
     * Set a validator on a function property
     * @param   {string}                                property    The property name
     * @param   {function(*):bool|Array|ValidatorChain} validator   The property validator
     * @returns {ObjectValidator}
     */

###. prop(property, validator)

    /**
     * Set a validator on a non-function property
     * @param   {string}                                property    The property name
     * @param   {function(*):bool|Array|ValidatorChain} validator   The property validator
     * @returns {ObjectValidator}
     */

### .validate(object, callback)

    /**
     * Validate the object
     * @param   {Object}                                object
     * @param   {function(Error, bool, Object)}         callback
     * @returns {ObjectValidator}
     */

## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.