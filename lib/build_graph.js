var Immutable = require('immutable');
var findByRequirement = require('./find_by');

function buildGraph(transitions) {
  var fromJS = Immutable.fromJS;
  transitions.forEach(function(transition) {
    var children = findByRequirement(
      fromJS(transition.provides),
      fromJS(transitions)
    ).toJS();
    transition.children = children;
  });
  return findByRequirement(fromJS({}), fromJS(transitions)).toJS();
}

module.exports = buildGraph;
