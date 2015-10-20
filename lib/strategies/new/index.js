var Immutable = require('immutable');
var findByRequirement = require('../../find_by');

function createPath(path) {
  path = path || Immutable.List();

  function findAppropriatePathSegment(transition) {
    var models = path.reduce(function(memo, segment) {
      var segmentModel = segment.reduce(function(memo, transition) {
        return memo.merge(transition.get('provides'));
      }, Immutable.Map());

      return memo.push(memo.last().merge(segmentModel));
    }, Immutable.List([Immutable.Map()]));

    var result = models.findIndex(function(model) {
      var matched = findByRequirement(model, Immutable.List([transition]));
      return matched.size === 1;
    });
    return result;
  }

  return {
    contains: function(transition) {
      return this.toList().indexOf(transition) !== -1;
    },
    size: function() {
      return path.size;
    },
    add: function(transition) {
      var segmentIndex = findAppropriatePathSegment(transition);
      if (segmentIndex >= 0 && segmentIndex < path.size) {
        return createPath(path.update(segmentIndex, function(segment) {
          return segment.add(transition);
        }));
      } else {
        return createPath(path.push(Immutable.Set([transition])));
      }
    },
    toList: function() {
      return path.reduce(function(memo, item) {
        return memo.concat(item.toList());
      }, Immutable.List());
    },
    toRaw: function() {
      return path;
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
  return findPaths(transitions).map(function(p) {
    return p.toRaw();
  }).toSet().toList().map(function(path) {
    path = createPath(path).toList();

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
