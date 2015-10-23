var Immutable = require('immutable');

var defaultStrategy = require('./strategies/revisit_transitions');

module.exports = function scenarioBuilder(transitions, verifications, strategy) {
  transitions = Immutable.fromJS(transitions);
  verifications = Immutable.fromJS(verifications)
  strategy = strategy || defaultStrategy;
  var testPlan = strategy(transitions, verifications);


  return {
    build: function(cb) {
      testPlan.forEach(function(scenario) {
        cb({
          name: scenario.get('name'),
          apply: function(system) {
            scenario.get('steps').reduce(function(memo, step) {
              console.log(step.get('name'));
              step.get('apply')(system, step.get('model').toJS());
              return system;
            }, system);
          }
        });
      });
    }
  };
}

