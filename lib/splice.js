var Immutable = require('immutable');
var updateState = require('./update_state');
var findByRequirement = require('./find_by');
var createVerificationGroup = require('./verification_group');

module.exports = function splice(verifications, path) {
  return path.reduce(function(memo, transition) {
    var newState = updateState(memo.state, transition);
    transition = transition.set('state', newState);
    var relevantVerifications = findByRequirement(newState, verifications);
    var steps = memo.steps
    .push(transition)
    .push(createVerificationGroup(relevantVerifications).set('state', newState));
    return {steps: steps, state: newState};
  }, {steps: Immutable.List(), state: Immutable.Map()}).steps;
}


