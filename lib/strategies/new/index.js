var Immutable = require('immutable');
var findByRequirement = require('../../find_by');

function createPath(path) {
  path = path || Immutable.List();

  return {
    contains: function(transition) {
      return path.indexOf(Immutable.Set([transition])) !== -1;
    },
    size: function() {
      return path.size;
    },
    add: function(transition) {
      return createPath(path.push(Immutable.Set([transition])));
    },
    toList: function() {
      return path.reduce(function(memo, item) {
        return memo.concat(item.toList());
      }, Immutable.List());
    }
  };
}

function findPaths(transitions, model, path) {
  model = model || Immutable.Map();
  path = path || createPath();

  var children = findByRequirement(model, transitions);

  var pathSets = children.map(function(child) {
    var childModel = model.merge(child.get('provides'));
    if (!path.contains(child) && path.size() < 5) {
      var childPath = path.add(child);
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
    path = path.toList();

    return path.reduce(function(memo, transition) {
      var newModel = memo.model.merge(transition.get('provides'));
      transition = transition.set('model', newModel);
      var relevantVerifications = findByRequirement(newModel, verifications).map(function(verification) {
        return verification.set('model', newModel);
      });
      var steps = memo.steps
        .push(transition)
        .concat(relevantVerifications);
      return {steps: steps, model: newModel};
    }, {steps: Immutable.List(), model: Immutable.Map()});
  }).map(function(result, i) {
    return Immutable.fromJS({name: '' + i, steps: result.steps});
  });
};
