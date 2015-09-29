var Immutable = require('immutable');
var buildGraph = require('./build_graph');
var buildTestPlans = require('./build_test_plans');
var findByRequirement = require('./find_by');
var printGraph = require('./print_graph');

module.exports = function scenarioBuilder(transitions, verifications) {
  return {
    build: function(cb) {
      var graph = buildGraph(Immutable.fromJS(transitions));
      printGraph(graph);
      var testPlans = buildTestPlans(Immutable.fromJS(transitions), graph, Immutable.List([transitions[0].name]));

      testPlans.forEach(function(plan, i) {
        var apply = function(system) {
          var model = Immutable.Map();
          plan.forEach(function(step) {
            console.log(step.get('name'));
            step.get('apply')(system);
            model = model.merge(step.get('provides'));
            var toVerify = findByRequirement(
              model,
              Immutable.fromJS(verifications)
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

