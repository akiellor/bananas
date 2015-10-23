var Immutable = require('immutable');

var transitions = Immutable.fromJS([
  {
    name: 'init',
    requires: function(model) {
      return !model.hasOwnProperty('volume');
    },
    provides: {volume: 0}
  },
  {
    name: 'pour',
    requires: function(model) {
      return model.volume > 0;
    },
    provides: {volume: 0}
  },
  {
    name: 'fill half',
    requires: function(model) {
      return model.volume === 0;
    },
    provides: {volume: 0.5}
  },
  {
    name: 'fill',
    requires: function(model) {
      return model.volume < 1;
    },
    provides: {volume: 1}
  }
]);

var verifications = Immutable.fromJS([
  {
    name: 'volume is one',
    requires: {volume: 1}
  }
]);

module.exports = {
  transitions: transitions,
  verifications: verifications
};

