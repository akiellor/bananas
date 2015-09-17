var Immutable = require('immutable');
var findByRequirement = require('./find_by');
var fromJS = Immutable.fromJS;

var emptyModel = fromJS({});

function buildGraph(transitions) {
  transitions = fromJS(transitions);
  transitions = transitions.map(function(transition) {
    var children = findByRequirement(transition.get('provides'), transitions);
    return transition.set('children', children);
  });
  return findByRequirement(emptyModel, transitions).toJS();
}

module.exports = buildGraph;
