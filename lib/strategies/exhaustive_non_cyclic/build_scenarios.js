var Immutable = require('immutable');

function traverse(graph, node, path) {
  path = path || Immutable.fromJS([]);
  path = path.push(node);
  var children = (graph.get(node) || Immutable.List());

  var paths = children.map(function(child) {
    if (path.indexOf(child) === -1) {
      return traverse(graph, child, path);
    } else {
      return Immutable.List([path]);
    }
  });

  if(paths.size === 0) {
    paths = Immutable.fromJS([[path]]);
  }

  return paths.reduce(function(memo, path) {
    return memo.concat(path);
  }, Immutable.List());
};

function tap(value) {
  console.log(value);
  return value;
}

function buildIndex(nodes) {
  return nodes.reduce(function(memo, node) {
    return memo.set(node.get('name'), node);
  }, Immutable.Map());
}

module.exports = function buildScenarios(nodes, graph, roots) {
  var index = buildIndex(nodes);
  return roots.map(function(node) {
    return traverse(graph, node);
  }).reduce(function(memo, pathSet) {
    return memo.concat(pathSet);
  }, Immutable.List()).map(function(path) {
    return path.map(function(node) { return index.get(node); });
  });
}
