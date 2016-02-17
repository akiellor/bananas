var Immutable = require('immutable');
var propertyConstraints = require('./property_constraints');

module.exports = function findByRequirement(model, transformations) {
  return transformations.filter(function(object) {
    var requires = object.get('requires') || Immutable.Map({});
    if (typeof requires === 'function') {
      return requires(state.toJS());
    } else if (requires.get('constraint')) {
      return propertyConstraints(requires.get('constraint'), state);
    } else {
      return requires.every(function(value, key) {
        return value === state.get(key);
      });
    }
  });
};
