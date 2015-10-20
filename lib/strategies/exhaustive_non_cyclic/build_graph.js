var Immutable = require('immutable');
var findByRequirement = require('../../find_by');
var fromJS = Immutable.fromJS;

var emptyModel = fromJS({});

function buildGraph(transitions) {
  return transitions.reduce(function(memo, transition) {
    var children = findByRequirement(transition.get('provides'), transitions).map(function(transition) {
      return transition.get('name');
    });
    return memo.set(transition.get('name'), children);
  }, Immutable.Map());
}

module.exports = buildGraph;
