var Immutable = require('immutable');
var findByRequirement = require('../../find_by');
var updateModel = require('../../update_model');
var Random = require('random-js');

var mt = Random.engines.mt19937();
mt.autoSeed();

function selectResult(transitions) {
  var index = Random.integer(0, transitions.size - 1)(mt);
  return transitions.get(index);
}

module.exports = function randomWalk(transitions) {
  var path = Immutable.List();
  var model = Immutable.Map();
  var visitedModels = Immutable.Map();

  while (path.size < 20) {
    var found = findByRequirement(model, transitions)
      .map(function(transition) {
        var newModel = updateModel(model, transition);
        return Immutable.Map({model: newModel, transition: transition});
      })
      .filter(function(result) {
        return (visitedModels.get(result.get('model')) || 0) < 3;
      });

    var result = selectResult(found);
    if (!result) {
      break;
    }

    var newModel = result.get('model');
    visitedModels = visitedModels.update(newModel, 0, function(value) {
      return value + 1;
    });
    path = path.push(result.get('transition'));
    model = newModel;
  }

  return Immutable.List([
    path
  ]);
};
