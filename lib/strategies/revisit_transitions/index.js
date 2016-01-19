var Immutable = require('immutable');
var findByRequirement = require('../../find_by');
var updateModel = require('../../update_model');
var createPath = require('./path');

function findPaths(transitions) {
  var nodes = [Immutable.Map({model: Immutable.Map({}), path: createPath()})];
  var paths = Immutable.Set();

  while (nodes.length > 0) {
    var node = nodes.pop();
    var model = node.get('model');
    var path = node.get('path');

    var children = findByRequirement(model, transitions);
    children = children.filter(function(child) {
      return !path.contains(child);
    });

    if (children.size === 0) {
      paths = paths.add(path.toRaw());
    } else {
      children.forEach(function(child) {
        var childModel = updateModel(model, child);
        var childPath = path.add(child);
        nodes.unshift(Immutable.Map({model: childModel, path: childPath}));
      });
    }
  }

  return Immutable.List(paths);
}

function interleaveVerifications(verifications, path) {
  return path.toList().reduce(function(memo, transition) {
    var newModel = updateModel(memo.model, transition);
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
  return paths.toList().map(createPath);
}

module.exports = function(transitions, verifications) {
  var paths = findPaths(transitions);
  paths = filterDuplicates(paths);
  return paths
    .map(interleaveVerifications.bind(null, verifications));
};
