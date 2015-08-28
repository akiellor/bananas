var buildGraph = require('./build_graph');
var buildTestPlans = require('./build_test_plans');
var findByRequirement = require('./find_by');

module.exports = function scenarioBuilder(transitions, verifications) {
  return {
    build: function(dsl, systemConstructor) {
      var graph = buildGraph(transitions);
      var testPlans = buildTestPlans(graph);

      dsl.describe('system', function() {
        testPlans.forEach(function(plan, i) {
          it('' + i, function() {
            var system = systemConstructor();
            plan.forEach(function(step) {
              console.log(step.name);
              step.apply(system);
              var toVerify = findByRequirement(step.expected, verifications);
              toVerify.forEach(function(verification) {
                console.log(verification.name);
                verification.apply(system);
              });
            });
          });
        });
      });
    }
  };
}

