var Immutable = require('immutable');

module.exports = function updateState(state, transition) {
  var provides = transition.get('provides');
  var change = provides;
  if (typeof provides === 'function') {
    change = Immutable.fromJS(provides(state.toJS()));
  }
  return state.merge(change);
};


