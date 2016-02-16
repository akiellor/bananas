var expect = require('chai').expect;

module.exports.transitions = [
  {
    name: 'init',
    requires: function(state) {
      return !state.hasOwnProperty('volume');
    },
    provides: {volume: 0},
    apply: function() {}
  },
  {
    name: 'pour',
    requires: function(state) {
      return state.volume > 0;
    },
    provides: {volume: 0},
    apply: function(system) { system.pour(); }
  },
  {
    name: 'fill half',
    requires: function(state) {
      return state.volume === 0;
    },
    provides: {volume: 0.5},
    apply: function(system) { system.add(0.5); }
  },
  {
    name: 'add 0.5',
    requires: function(state) {
      return state.volume !== undefined && state.volume !== 1;
    },
    provides: function(state) {
      state.volume = state.volume + 0.5;
      return state;
    },
    apply: function(system) { system.add(0.5); }
  },
  {
    name: 'fill',
    requires: function(state) {
      return state.volume < 1;
    },
    provides: {volume: 1},
    apply: function(system) { system.fill(); }
  }
];

module.exports.verifications = [
  {
    name: 'volume is one',
    requires: {volume: 1},
    apply: function(system) {
      expect(system.isFull()).to.equal(true);
    }
  }
];

