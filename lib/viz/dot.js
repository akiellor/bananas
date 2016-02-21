var states = require('../states');
var graphviz = require('graphviz');

function sanitize(string) {
  return string.replace(/([:{} "\[\]])/g, '\\$1');
}

function serialise(state) {
  return sanitize(state.sortBy(function(value, key) { return key; }).toString());
}

module.exports = function dot(transitions) {
  var g = graphviz.digraph("G");

  states(transitions).forEach(function(value, state) {
    var n1 = g.addNode(serialise(state));
    value.forEach(function(otherState, edgeName) {
      var n2 = g.addNode(serialise(otherState));
      g.addEdge(n1, n2)
      .set('label', edgeName);
    });
  });

  return g.to_dot();
};
