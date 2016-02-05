var Immutable = require('immutable');
var findByRequirement = require('./find_by');
var updateModel = require('./update_model');

module.exports = function states(transitions) {
  var queue = [];
  var states = Immutable.Map();
  var rootTransitions = findByRequirement(Immutable.Map(), transitions);

  rootTransitions.forEach(function(t) {
    var node = Immutable.Map({model: Immutable.Map(), transition: t})
    queue.push(node);
  });

  while (queue.length > 0) {
    var node = queue.shift();
    var model = node.get('model');
    var transition = node.get('transition');

    var newModel = updateModel(model, transition);
    if (!states.has(newModel)) {
      var moreTransitions = findByRequirement(newModel, transitions);
      moreTransitions.forEach(function(t) { queue.push(Immutable.Map({model: newModel, transition: t })); });
    }

    states = states.update(model, Immutable.Map(), function(value) {
      return value.set(transition.get('name'), newModel);
    });
  }

  return states;
}

