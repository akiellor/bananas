var Immutable = require('immutable');
var findByRequirement = require('../../find_by');
var updateState = require('../../update_state');
var Random = require('random-js');

function selectResult(transitions, engine) {
  var index = Random.integer(0, transitions.size - 1)(engine);
  return transitions.get(index);
}

function createEngine(seed) {
  var mt = Random.engines.mt19937();
  if (seed !== undefined) {
    mt.seed(seed);
  } else {
    mt.autoSeed();
  }
  return mt;
}

module.exports = function quick(transitions, options) {
  options = options || {};

  var path = Immutable.List();
  var state = Immutable.Map();
  var visitedEdges = Immutable.Set();
  var engine = createEngine(options.seed);

  while (path.size < 20) {
    var found = findByRequirement(state, transitions)
      .map(function(transition) {
        var newState = updateState(state, transition);
        return Immutable.Map({state: newState, transition: transition});
      })
      .filter(function(result) {
        var edge = Immutable.Map({
          source: state,
          destination: result.get('state'),
          transition: result.get('transition').get('name')
        });
        return !visitedEdges.has(edge);
      });

    var result = selectResult(found, engine);
    if (!result) {
      break;
    }

    var edge = Immutable.Map({
      source: state,
      destination: result.get('state'),
      transition: result.get('transition').get('name')
    });

    var newState = result.get('state');
    visitedEdges = visitedEdges.add(edge);
    path = path.push(result.get('transition'));
    state = newState;
  }

  return Immutable.List([
    path
  ]);
};
