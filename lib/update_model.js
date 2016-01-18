var Immutable = require('immutable');

module.exports = function updateModel(model, transition) {
  var provides = transition.get('provides');
  var change = provides;
  if (typeof provides === 'function') {
    change = Immutable.fromJS(provides(model.toJS()));
  }
  return model.merge(change);
}


