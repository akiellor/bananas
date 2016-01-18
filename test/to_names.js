module.exports = function toNames(testPlan) {
  return testPlan.map(function(scenario) {
    return scenario.map(function(transition) {
      return transition.get('name');
    });
  });
}
