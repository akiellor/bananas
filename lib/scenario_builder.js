var buildGraph = require('./build_graph');
var buildTestPlans = require('./build_test_plans');
var findByRequirement = require('./find_by');
var printGraph = require('./print_graph');

function merge(a, b) {
  var result = {};
  Object.keys(a).forEach(function(key) {
    result[key] = a[key];
  });
  Object.keys(b).forEach(function(key) {
    result[key] = b[key];
  });
  return result;
}

module.exports = function scenarioBuilder(transitions, verifications) {
  return {
    build: function(dsl, systemConstructor) {
      var graph = buildGraph(transitions);
      printGraph(graph);
      var testPlans = buildTestPlans(graph);

      dsl.describe('system', function() {
        testPlans.forEach(function(plan, i) {
          it('' + i, function() {
            var system = systemConstructor();
            var model = {};
            plan.forEach(function(step) {
              console.log(step.name);
              step.apply(system);
              model = merge(model, step.provides);
              var toVerify = findByRequirement(model, verifications);
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

