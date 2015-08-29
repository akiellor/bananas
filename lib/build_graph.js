var findByRequirement = require('./find_by');

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

function buildGraph(transitions) {
  var graph = [];
  var model = {};
  var root = findByRequirement(model, transitions)[0];
  var pastTransitions = {};
  var queue = [root];
  var children;

  console.log(root);
  while (queue.length > 0) {
    var transition = queue.shift();
    pastTransitions[transition.name] = true;
    model = merge(model, transition.provides);
    children = findByRequirement(model, transitions)
    .filter(function(transition) {
      return !pastTransitions.hasOwnProperty(transition.name);
    })
    .sort(function(a, b) {
      return Object.keys(b.requires || {}).length - Object.keys(a.requires || {}).length;
    });
    graph.push(transition);
    queue = queue.concat(children);
    transition.children = children;
    transition.expected = model;
  }
  return graph;
}

module.exports = buildGraph;
