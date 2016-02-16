var Immutable = require('immutable');
var findByRequirement = require('../../find_by');
var updateState = require('../../update_state');

module.exports = function createPath(path) {
  path = path || Immutable.List();

  function finalSegmentPrerequisiteState() {
    return path.slice(0, -1).reduce(function(memo, segment) {
      return segment.reduce(function(memo, transition) {
        return updateState(memo, transition);
      }, memo);
    }, Immutable.Map());
  }

  function findAppropriatePathSegment(transition) {
    var state = finalSegmentPrerequisiteState();
    var matched = findByRequirement(state, Immutable.List([transition]));
    return matched.size === 1 ? (path.size - 1) : -1;
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
