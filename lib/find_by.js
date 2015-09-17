var Immutable = require('immutable');

module.exports = function findByRequirement(model, hasRequirements) {
  hasRequirements = Immutable.fromJS(hasRequirements);
  model = Immutable.fromJS(model);

  return hasRequirements.filter(function(object) {
    var requires = object.get('requires') || Immutable.Map({});

    if (typeof requires === 'function') {
      return requires(model.toJS());
    } else {
      return requires.every(function(value, key) {
        return value === model.get(key);
      });
    }
  }).toJS();
}
