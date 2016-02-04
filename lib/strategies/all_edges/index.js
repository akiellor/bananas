var Immutable = require('immutable');
var findStates = require(__dirname + '/../../states');

module.exports = function(transitions) {
  var states = findStates(transitions);

  var queue = [];
  var paths = [];
  var edgesFollowed = Immutable.Set();
  var statesBySource = states.reduce(function(memo, sources, destination) {
    return sources.reduce(function(memo, name, source) {
      return memo.update(source, Immutable.Map(), function(value) {
        return value.set(destination, name);
      });
    }, memo);
  }, Immutable.Map());
  statesBySource.get(Immutable.Map()).
    forEach(function(value, key) {
      queue.push(Immutable.Map({state: key, path: Immutable.List([value])}));
    });

  while(queue.length > 0) {
    var node = queue.pop();

    var outbound = statesBySource.get(node.get('state')) || Immutable.List();
    var nonVisited = outbound.filter(function(name, model) {
      return !edgesFollowed.has(Immutable.Map({source: model, name: name, destination: node.get('state')}));
    });

    if (nonVisited.isEmpty()) {
      paths.push(node.get('path'));
      continue
    } else {
      nonVisited.forEach(function(name, model) {
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

