var Immutable = require('immutable');
var buildGraph = require('./build_graph');
var buildTestPlans = require('./build_test_plans');
var findByRequirement = require('./find_by');
var printGraph = require('./print_graph');

module.exports = function scenarioBuilder(transitions, verifications) {
  transitions = Immutable.fromJS(transitions);
  verifications = Immutable.fromJS(verifications)

  var roots = transitions.slice(0, 1).map(function(transition) {
    return transition.get('name');
  });

  return {
    build: function(cb) {
      var graph = buildGraph(transitions);
      printGraph(graph);
      var testPlans = buildTestPlans(transitions, graph, roots);

      testPlans.forEach(function(plan, i) {
        var apply = function(system) {
          var model = Immutable.Map();
          plan.forEach(function(step) {
            console.log(step.get('name'));
            step.get('apply')(system);
            model = model.merge(step.get('provides'));
            var toVerify = findByRequirement(
              model,
              verifications
            );
            toVerify.forEach(function(verification) {
              console.log(verification.get('name'));
              verification.get('apply')(system);
            });
          });
        };
        cb({
          name: '' + i,
          apply: apply
        });
      });
    }
  };
}

