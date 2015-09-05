module.exports = function printGraph(graph, visitNode) {
  var queue = [];
  var visited = [];

  function pushAll(nodes) {
    nodes.forEach(function(n) {
      if (visited.indexOf(n) === -1) {
        queue.push(n);
        visited.push(n);
      }
    });
  }

  pushAll(graph);

  while(queue.length > 0) {
    var node = queue.pop();
    pushAll(node.children || []);
    visitNode(node);
  }
}
