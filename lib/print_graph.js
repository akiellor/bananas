var traverse = require('./traverse');

module.exports = function printGraph(graph) {
  traverse(graph, function(node) {
    console.log(node.name);
    (node.children || []).forEach(function(child) {
      console.log('    ' + child.name);
    });
  });
};
