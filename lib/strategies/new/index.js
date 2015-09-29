var Immutable = require('immutable');
var findByRequirement = require('../../find_by');

function findPaths(transitions, model, path) {
  model = model || Immutable.Map();
  path = path || Immutable.List();

  var children = findByRequirement(model, transitions);

  var pathSets = children.map(function(child) {
    var childModel = model.merge(child.get('provides'));
    child = child.set('model', childModel);
    if (path.indexOf(child) === -1 && path.size < 5) {
      var childPath = path.push(child);
      return findPaths(transitions, childModel, childPath);
    } else {
      return Immutable.List();
    }
  });

  var paths = pathSets.reduce(function(memo, pathSet) {
    return memo.concat(pathSet);
  }, Immutable.List());

  if (paths.size === 0) {
    return Immutable.List([path]);
  } else {
    return paths;
  }
}

module.exports = function(transitions, verifications) {
  return findPaths(transitions).map(function(path) {
    return path.reduce(function(memo, transition) {
      return memo
        .push(transition)
        .concat(findByRequirement(transition.get('model'), verifications));
    }, Immutable.List());
  }).map(function(steps, i) {
    return Immutable.fromJS({name: '' + i, steps: steps});
  });
};
