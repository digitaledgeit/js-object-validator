var ObjectValidator = require('..');

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
  //.optional(true)
  //.fn('getStreet',   [[isNotEmpty, 'Street cannot be empty']])
  //.fn('getSuburb',   [[isNotEmpty, 'Suburb cannot be empty']])
  //.fn('getPostcode', [[isNotEmpty, 'Postcode cannot be empty']])
  //.fn('getState',    [
  //  [isNotEmpty, 'State cannot be empty'],
  //  [isInArray(['NSW', 'QLD', 'VIC', 'ACT', 'NT', 'TAS', 'SA', 'WA']), 'Invalid state']
  //])
  //.prop('matched', [
  //  [isNotEmpty, 'Partial must be defined'],
  //  [isBool, 'Partial must be a bool'],
  //  [isTrue, 'Partial must be true']
  //])
  //.prop('location.lat', [
  //  [isNotEmpty, 'Latitude cannot be empty'],
  //  [function(value) {return value > 33}, 'Wrong part of the world']
  //])
  //.prop('location.lng', [
  //  [isNotEmpty, 'Longitude cannot be empty'],
  //  [function(value) {return value > 11}, 'Wrong part of the world']
  //])
  .validate(address, function(error, valid, messages) {
    console.log('validated: ', error, valid, messages)
  })
;