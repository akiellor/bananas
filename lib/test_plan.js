var Immutable = require('immutable');
var createHash = require('sha.js');

var defaultStrategy = require('./strategies/all_edges');
var updateModel = require('./update_model');
var findByRequirement = require('./find_by');

function interleaveVerifications(verifications, path) {
  return path.reduce(function(memo, transition) {
    var newModel = updateModel(memo.model, transition);
    transition = transition.set('model', newModel);
    var relevantVerifications = findByRequirement(newModel, verifications).map(function(verification) {
      return verification.set('model', newModel);
    });
    var steps = memo.steps
    .push(transition)
    .concat(relevantVerifications);
    return {steps: steps, model: newModel};
  }, {steps: Immutable.List(), model: Immutable.Map()}).steps;
}

module.exports = function createTestPlan(transitions, verifications, strategy) {
  transitions = Immutable.fromJS(transitions);
  verifications = Immutable.fromJS(verifications)
  strategy = strategy || defaultStrategy;
  var paths = strategy(transitions, verifications);
  var testPlan = paths.map(interleaveVerifications.bind(null, verifications));

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

