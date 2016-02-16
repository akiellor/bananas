var Immutable = require('immutable');

module.exports = function findByRequirement(state, hasRequirements) {
  return hasRequirements.filter(function(object) {
    var requires = object.get('requires') || Immutable.Map({});

    if (typeof requires === 'function') {
      return requires(state.toJS());
    } else {
      return requires.every(function(value, key) {
        return value === state.get(key);
      });
    }
  });
}
