var Immutable = require('immutable');
var createHash = require('sha.js');

var defaultStrategy = require('./strategies/brute');
var updateState = require('./update_state');
var findByRequirement = require('./find_by');
var splice = require('./splice');

function createName(scenario) {
  var name = scenario.map(function(step) {
    return step.get('name');
  }).join(':');
  return createHash('sha256').update(name, 'utf-8').digest('hex').slice(0, 5);
}

module.exports = function createTestPlan(transitions, verifications, strategy) {
  transitions = Immutable.fromJS(transitions);
  verifications = Immutable.fromJS(verifications);
  strategy = strategy || defaultStrategy;
  var paths = strategy(transitions);
  var testPlan = paths.map(splice.bind(null, verifications));

  return testPlan.map(function(scenario) {
    return {
      name: createName(scenario),
      apply: function(system) {
        scenario.reduce(function(memo, step) {
          step.get('apply')(system, step.get('state').toJS());
          return system;
        }, system);
      }
    };
  }).toJS();
};

