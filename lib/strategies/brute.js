var Immutable = require('immutable');
var findStates = require(__dirname + '/../states');

/**
 * This function generates a test plan such that all possible model states and
 * transitions from those states are exercised.
 *
 * @param {Array} transitions a list of transition objects.
 * @returns {Array} a test plan.
 */
module.exports = function brute(transitions) {
  var states = findStates(transitions);

  var queue = [];
  var paths = Immutable.List();
  var edgesFollowed = Immutable.Set();
  var states = findStates(transitions)
  states.get(Immutable.Map()).
    forEach(function(state, name) {
      queue.push(Immutable.Map({state: state, path: Immutable.List([name])}));
    });

  while(queue.length > 0) {
    var node = queue.pop();

    var outbound = states.get(node.get('state')) || Immutable.List();
    var nonVisited = outbound.filter(function(state, name) {
      return !edgesFollowed.has(Immutable.Map({source: state, name: name, destination: node.get('state')}));
    });

    if (nonVisited.isEmpty()) {
      paths = paths.push(node.get('path'));
      continue
    } else {
      nonVisited.forEach(function(state, name) {
        edgesFollowed = edgesFollowed.add(Immutable.Map({source: state, name: name, destination: node.get('state')}));
        var newPath = node.get('path').push(name);
        queue.push(Immutable.Map({state: state, path: newPath}));
      });
    }
  }

  return paths.map(function(path) {
    return path.map(function(name) {
      return transitions.find(function(t) { return t.get('name') === name; })

    });
  });
};

