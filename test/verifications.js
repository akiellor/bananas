var expect = require('chai').expect;

module.exports = [
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
