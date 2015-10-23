var Immutable = require('immutable');
var findByRequirement = require('../../find_by');
var createPath = require('./path');

function findPaths(transitions, model, path) {
  model = model || Immutable.Map();
  path = path || createPath();

  var children = findByRequirement(model, transitions);

  var pathSets = children.map(function(child) {
    var childModel = model.merge(child.get('provides'));
    if (!path.contains(child)) {
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

function interleaveVerifications(verifications, path) {
  return path.toList().reduce(function(memo, transition) {
    var newModel = memo.model.merge(transition.get('provides'));
    transition = transition.set('model', newModel);
    var relevantVerifications = findByRequirement(newModel, verifications).map(function(verification) {
      return verification.set('model', newModel);
    });
    var steps = memo.steps
    .push(transition)
    .concat(relevantVerifications);
    return {steps: steps, model: newModel};
  }, {steps: Immutable.List(), model: Immutable.Map()}).steps;
}

function filterDuplicates(paths) {
  return paths.map(function(p) {
    return p.toRaw();
  }).toSet().toList().map(createPath);
}

module.exports = function(transitions, verifications) {
  var paths = findPaths(transitions);
  paths = filterDuplicates(paths);
  return paths
    .map(interleaveVerifications.bind(null, verifications));
};
