var Immutable = require('immutable');
var findByRequirement = require('../../find_by');
var updateState = require('../../update_state');
var createPath = require('./path');

function findPaths(transitions) {
  var nodes = [Immutable.Map({state: Immutable.Map({}), path: createPath()})];
  var paths = Immutable.Set();

  while (nodes.length > 0) {
    var node = nodes.pop();
    var state = node.get('state');
    var path = node.get('path');

    var children = findByRequirement(state, transitions);
    children = children.filter(function(child) {
      return !path.contains(child);
    });

    if (children.size === 0) {
      paths = paths.add(path.toRaw());
    } else {
      children.forEach(function(child) {
        var childState = updateState(state, child);
        var childPath = path.add(child);
        nodes.unshift(Immutable.Map({state: childState, path: childPath}));
      });
    }
  }

  return Immutable.List(paths);
}

function filterDuplicates(paths) {
  return paths.toList().map(createPath);
}

module.exports = function revisit(transitions) {
  var paths = findPaths(transitions);
  return filterDuplicates(paths).map(function(p) {
    return p.toList();
  });
};
