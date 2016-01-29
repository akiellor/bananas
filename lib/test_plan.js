var Immutable = require('immutable');
var createHash = require('sha.js');

var defaultStrategy = require('./strategies/revisit_transitions');

module.exports = function createTestPlan(transitions, verifications, strategy) {
  transitions = Immutable.fromJS(transitions);
  verifications = Immutable.fromJS(verifications)
  strategy = strategy || defaultStrategy;
  var testPlan = strategy(transitions, verifications);

  function createName(scenario) {
    var name = scenario.map(function(step) {
      return step.get('name');
    }).join(':');
    return createHash('sha256').update(name, 'utf-8').digest('hex').slice(0, 5);
  }

  return testPlan.map(function(scenario) {
    return {
      name: createName(scenario),
      apply: function(system) {
        scenario.reduce(function(memo, step) {
          console.log(step.get('name'));
          step.get('apply')(system, step.get('model').toJS());
          return system;
        }, system);
      }
    }
  }).toJS();
}
