var Immutable = require('immutable');
var findByRequirement = require('../../find_by');

function findPaths(transitions) {
  var model = Immutable.Map();
  var path = Immutable.List();
  var node = [Immutable.Map({model: Immutable.Map()})];
  while (node.length > 0) {
    var visitingNode = node.pop();
    var children = findByRequirement(visitingNode.get('model'), transitions);
    children.forEach(function(child) {
      var childModel = model.merge(child.get('provides'));
      child = child.set('model', childModel);
      if(path.indexOf(child) === -1) {
        node.push(child);
        path = path.push(child);
      }
    });
  }
  return path;

}


module.exports = function(transitions, verifications) {
  return Immutable.List([
    Immutable.Map({
      name: "All Transitions", steps: findPaths(transitions)
        .map(function(transition) {
          var relevantVerifications = findByRequirement(transition.get('model'), verifications)
            .map(function(verification) {
              return verification.set('model', transition.get('model'));
            });
          return Immutable.List()
            .push(transition)
            .concat(relevantVerifications);
        }).reduce(function(mem, curr) {
          return mem.concat(curr);
        }, Immutable.List())
    })
  ]);

};