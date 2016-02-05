var Immutable = require('immutable');
var findStates = require(__dirname + '/../../states');

module.exports = function(transitions) {
  var states = findStates(transitions);

  var queue = [];
  var paths = [];
  var edgesFollowed = Immutable.Set();
  var states = findStates(transitions)
  states.get(Immutable.Map()).
    forEach(function(model, name) {
      queue.push(Immutable.Map({state: model, path: Immutable.List([name])}));
    });

  while(queue.length > 0) {
    var node = queue.pop();

    var outbound = states.get(node.get('state')) || Immutable.List();
    var nonVisited = outbound.filter(function(model, name) {
      return !edgesFollowed.has(Immutable.Map({source: model, name: name, destination: node.get('state')}));
    });

    if (nonVisited.isEmpty()) {
      paths.push(node.get('path'));
      continue
    } else {
      nonVisited.forEach(function(model, name) {
        edgesFollowed = edgesFollowed.add(Immutable.Map({source: model, name: name, destination: node.get('state')}));
        var newPath = node.get('path').push(name);
        queue.push(Immutable.Map({state: model, path: newPath}));
      });
    }
  }

  return Immutable.fromJS(paths.map(function(path) {
    return path.map(function(name) {
      return transitions.find(function(t) { return t.get('name') === name; })

    });
  }));
};

