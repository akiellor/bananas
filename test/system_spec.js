var scenarioBuilder = require(__dirname + '/../lib/scenario_builder');
var expect = require('chai').expect;

var transitions = [
  {
    name: 'push empty',
    requires: {},
    provides: {full: true},
    apply: function(system) {
      system.push(1);
    }
  },
  {
    name: 'pop',
    requires: {full: true},
    provides: {full: false},
    apply: function(system) {
      system.pop();
    }
  }
];

var verifications = [
  {
    name: 'empty',
    requires: {full: false},
    apply: function(system) {
      expect(system.length).to.equal(0);
    }
  },
  {
    name: 'full',
    requires: {full: true},
    apply: function(system) {
      expect(system.length).to.equal(1);
    }
  }
];

var builder = scenarioBuilder(transitions, verifications);
builder.build(global, function() { return []; });
