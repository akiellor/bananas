var Immutable = require('immutable');
var buildGraph = require('./build_graph');
var buildScenarios = require('./build_scenarios');
var findByRequirement = require('../../find_by');

module.exports = function exhaustiveNonCyclic(transitions, verifications) {
  var roots = transitions.slice(0, 1).map(function(transition) {
    return transition.get('name');
  });

  var graph = buildGraph(transitions);
  var scenarios = buildScenarios(transitions, graph, roots);

  var testPlan = scenarios.map(function(scenario, i) {
    var name = '' + i;

    var steps = scenario.reduce(function(memo, step) {
      var model = memo.getIn([-1, 'model']) || Immutable.Map();
      memo = memo.push(step.set('model', model));
      model = model.merge(step.get('provides'));
      var toVerify = findByRequirement(
        model,
        verifications
      ).map(function(verification) {
        return verification.set('model', model);
      });
      return memo.concat(toVerify);
    }, Immutable.List());

    return Immutable.Map({
      name: name,
      steps: steps
    });
  });

  return testPlan;
}
