var Immutable = require('immutable');
var findByRequirement = require('./find_by');
var updateState = require('./update_state');

module.exports = function states(transitions) {
  var queue = [];
  var states = Immutable.Map();
  var rootTransitions = findByRequirement(Immutable.Map(), transitions);

  rootTransitions.forEach(function(t) {
    var node = Immutable.Map({state: Immutable.Map(), transition: t})
    queue.push(node);
  });

  while (queue.length > 0) {
    var node = queue.shift();
    var state = node.get('state');
    var transition = node.get('transition');

    var newState = updateState(state, transition);
    if (!states.has(newState)) {
      var moreTransitions = findByRequirement(newState, transitions);
      moreTransitions.forEach(function(t) { queue.push(Immutable.Map({state: newState, transition: t })); });
    }

    states = states.update(state, Immutable.Map(), function(value) {
      return value.set(transition.get('name'), newState);
    });
  }

  return states;
}

