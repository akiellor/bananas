function merge(a, b) {
  var result = {};
  Object.keys(a).forEach(function(key) {
    result[key] = a[key];
  });
  Object.keys(b).forEach(function(key) {
    result[key] = b[key];
  });
  return result;
}

function findByRequirement(model, hasRequirements) {
  return hasRequirements.filter(function(object) {
    return Object.keys(object.requires || {}).every(function(requiredKey) {
      return object.requires[requiredKey] === model[requiredKey];
    });
  });
}

function findTransitions(model, transitions) {
  return findByRequirement(model, transitions);
}

function findVerifications(model, transitions) {
  return findByRequirement(model, verifications);
}

function buildGraph(transitions) {
  var graph = [];
  var model = {};
  var root = findTransitions(model, transitions)[0];
  var pastTransitions = {};
  var queue = [root];
  var children;

  while (queue.length > 0) {
    var transition = queue.shift();
    pastTransitions[transition.name] = true;
    model = merge(model, transition.provides);
    children = findTransitions(model, transitions)
    .filter(function(transition) {
      return !pastTransitions.hasOwnProperty(transition.name);
    })
    .sort(function(a, b) {
      return Object.keys(b.requires || {}).length - Object.keys(a.requires || {}).length;
    });
    graph.push(transition);
    queue = queue.concat(children);
    transition.children = children;
  }
  return graph;
}

module.exports = buildGraph;
