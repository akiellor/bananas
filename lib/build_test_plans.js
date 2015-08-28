var graphTraversal = require(__dirname + '/../lib/graph_traversal');

module.exports = function buildTestPlans(graph) {
  var result = [];
  graphTraversal(graph, function(node) {
    var plansWithParent = result.filter(function(plan) {
      return plan[plan.length - 1].children.indexOf(node) !== -1;
    });
    if (plansWithParent.length === 0) {
      result.push([node])
    } else {
      plansWithParent.forEach(function(plan) {
        plan.push(node);
      });
    }
  });
  return result;
}
