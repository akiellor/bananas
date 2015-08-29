function traverse(node, visitPaths, visited, accumulator) {
  visited = visited || {};
  accumulator = accumulator || [];
  accumulator.push(node);

  var childrenToVisit = ((node && node.children) || []).filter(function(child) {
    return !visited[child.name];
  });

  if(!(node && childrenToVisit.length > 0)) {
    visitPaths(accumulator);
    return;
  }

  childrenToVisit.forEach(function(child) {
    if(!visited[child.name]) {
      visited[child.name] = true;
      traverse(child, visitPaths, visited, Array.prototype.slice.apply(accumulator));
      visited[child.name] = false;
    }
  });
  return accumulator;
};

module.exports = function buildTestPlans(graph) {
  if(graph.length === 0) {
    return [];
  }
  var results = [];
  traverse(graph[0], function(path) {
    results.push(path);
  });
  return results;
}
