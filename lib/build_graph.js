var findByRequirement = require('./find_by');

function buildGraph(transitions) {
  transitions.forEach(function(transition) {
    var children = findByRequirement(transition.provides, transitions);
    transition.children = children;
  });
  return transitions;
}

module.exports = buildGraph;
