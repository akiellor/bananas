var scenarioBuilder = require(__dirname + '/../lib/scenario_builder');
var expect = require('chai').expect;

function sut() {
  var state = [false, false, false];

  return {
    flip: function(index) {
      state[index] = !state[index];
    },
    _state: state
  };
}

var transitions = [
  {
    name: 'flip 0 from initial',
    requires: {first: undefined},
    provides: {first: 1},
    apply: function(system) {
      system.flip(0);
    }
  },
  {
    name: 'flip 0 from 1',
    requires: {first: 1},
    provides: {first: 0},
    apply: function(system) {
      system.flip(0);
    }
  },
  {
    name: 'flip 0 from 0',
    requires: {first: 0},
    provides: {first: 1},
    apply: function(system) {
      system.flip(0);
    }
  },
  {
    name: 'flip 1 from initial',
    requires: {second: undefined},
    provides: {second: 1},
    apply: function(system) {
      system.flip(1);
    }
  },
  {
    name: 'flip 1 from 1',
    requires: {second: 1},
    provides: {second: 0},
    apply: function(system) {
      system.flip(1);
    }
  },
  {
    name: 'flip 1 from 0',
    requires: {second: 0},
    provides: {second: 1},
    apply: function(system) {
      system.flip(1);
    }
  },
  {
    name: 'flip 2 from initial',
    requires: {third: undefined},
    provides: {third: 1},
    apply: function(system) {
      system.flip(2);
    }
  },
  {
    name: 'flip 2 from 1',
    requires: {third: 1},
    provides: {third: 0},
    apply: function(system) {
      system.flip(2);
    }
  },
  {
    name: 'flip 2 from 0',
    requires: {third: 0},
    provides: {third: 1},
    apply: function(system) {
      system.flip(2);
    }
  }
];

var verifications = [
  {
    name: 'third is 0',
    requires: {third: 0},
    apply: function(system) {
      expect(system._state[2]).to.equal(false);
    }
  },
  {
    name: 'third is 1',
    requires: {third: 1},
    apply: function(system) {
      expect(system._state[2]).to.equal(true);
    }
  },
  {
    name: 'second is 1',
    requires: {second: 1},
    apply: function(system) {
      expect(system._state[1]).to.equal(true);
    }
  },
  {
    name: 'second is 0',
    requires: {second: 0},
    apply: function(system) {
      expect(system._state[1]).to.equal(false);
    }
  },
  {
    name: 'first is 1',
    requires: {first: 1},
    apply: function(system) {
      expect(system._state[0]).to.equal(true);
    }
  },
  {
    name: 'first is 0',
    requires: {first: 0},
    apply: function(system) {
      expect(system._state[0]).to.equal(false);
    }
  }
];

var builder = scenarioBuilder(transitions, verifications);
builder.build(global, sut);
