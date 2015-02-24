var ObjectValidator = require('..');

var states = ['NSW', 'QLD', 'VIC', 'ACT', 'NT', 'TAS', 'SA', 'WA'];

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
  partial: true,
  getStreet: function() {return '22 Honeysuckle Dr';},
  getSuburb: function() {return 'Newcastle';},
  getState: function() {return 'NSW';},
  getPostcode: function() {return '2300';}
};

ObjectValidator()
  .optional(true)
  .fn('getStreet',   [[isNotEmpty, 'Street cannot be empty']])
  .fn('getSuburb',   [[isNotEmpty, 'Suburb cannot be empty']])
  .fn('getState',    [[isNotEmpty, 'State cannot be empty'], [isInArray(states), 'Invalid state']])
  .fn('getPostcode', [[isNotEmpty, 'Postcode cannot be empty']])
  .prop('partial', [[isNotEmpty, 'Partial must be defined'], [isBool, 'Partial must be a bool'], [isTrue, 'Partial must be true']])
  .validate(address, function(error, valid, messages) {
    console.log('validated: ', error, valid, messages)
  })
;