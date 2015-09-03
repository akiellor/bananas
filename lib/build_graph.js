var findByRequirement = require('./find_by');

function buildGraph(transitions) {
  transitions.forEach(function(transition) {
    var children = findByRequirement(transition.provides, transitions);
    transition.children = children;
  });
  return findByRequirement({}, transitions);
}

module.exports = buildGraph;
