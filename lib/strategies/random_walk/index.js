var Immutable = require('immutable');
var findByRequirement = require('../../find_by');
var updateModel = require('../../update_model');

function selectTransition(transitions) {
  var index = Math.floor(Math.random() * transitions.size);
  return transitions.get(index);
}

module.exports = function randomWalk(transitions) {
  var path = Immutable.List();
  var model = Immutable.Map();

  for (var i = 0; i < 20; i++) {
    var found = findByRequirement(model, transitions);
    var transition = selectTransition(found);
    if (!transition) {
      break;
    }
    model = updateModel(model, transition);
    path = path.push(transition);
  }

  return Immutable.List([
    path
  ]);
};
