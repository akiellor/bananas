var Immutable = require('immutable');
var exhaustiveNonCyclic = require('./strategies/exhaustive_non_cyclic');

module.exports = function scenarioBuilder(transitions, verifications) {
  transitions = Immutable.fromJS(transitions);
  verifications = Immutable.fromJS(verifications)
  var testPlan = exhaustiveNonCyclic(transitions, verifications);

  return {
    build: function(cb) {
      testPlan.forEach(function(scenario) {
        cb({
          name: scenario.get('name'),
          apply: function(system) {
            scenario.get('steps').reduce(function(memo, step) {
              console.log(step.get('name'));
              step.get('apply')(system);
              return system;
            }, system);
          }
        });
      });
    }
  };
}

