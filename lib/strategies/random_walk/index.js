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
  var visitedEdges = Immutable.Set();

  while (path.size < 20) {
    var found = findByRequirement(model, transitions)
      .map(function(transition) {
        var newModel = updateModel(model, transition);
        return Immutable.Map({model: newModel, transition: transition});
      })
      .filter(function(result) {
        var edge = Immutable.Map({
          source: model,
          destination: result.get('model'),
          transition: result.get('transition').get('name')
        });
        return !visitedEdges.has(edge);
      });

    var result = selectResult(found);
    if (!result) {
      break;
    }

    var edge = Immutable.Map({
      source: model,
      destination: result.get('model'),
      transition: result.get('transition').get('name')
    });

    var newModel = result.get('model');
    visitedEdges = visitedEdges.add(edge);
    path = path.push(result.get('transition'));
    model = newModel;
  }

  return Immutable.List([
    path
  ]);
};
