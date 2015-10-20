var Immutable = require('immutable');
var findByRequirement = require('../../find_by');

module.exports = function createPath(path) {
  path = path || Immutable.List();

  function findAppropriatePathSegment(transition) {
    var models = path.reduce(function(memo, segment) {
      var segmentModel = segment.reduce(function(memo, transition) {
        return memo.merge(transition.get('provides'));
      }, Immutable.Map());

      return memo.push(memo.last().merge(segmentModel));
    }, Immutable.List([Immutable.Map()]));

    var result = models.findIndex(function(model) {
      var matched = findByRequirement(model, Immutable.List([transition]));
      return matched.size === 1;
    });
    return result;
  }

  return {
    contains: function(transition) {
      return this.toList().indexOf(transition) !== -1;
    },
    size: function() {
      return path.size;
    },
    add: function(transition) {
      var segmentIndex = findAppropriatePathSegment(transition);
      if (segmentIndex >= 0 && segmentIndex < path.size) {
        return createPath(path.update(segmentIndex, function(segment) {
          return segment.add(transition);
        }));
      } else {
        return createPath(path.push(Immutable.Set([transition])));
      }
    },
    toList: function() {
      return path.reduce(function(memo, item) {
        return memo.concat(item.toList());
      }, Immutable.List());
    },
    toRaw: function() {
      return path;
    }
  };
}
