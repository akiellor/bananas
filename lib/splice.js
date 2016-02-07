var Immutable = require('immutable');
var updateModel = require('./update_model');
var findByRequirement = require('./find_by');
var createVerificationGroup = require('./verification_group');

module.exports = function splice(verifications, path) {
  return path.reduce(function(memo, transition) {
    var newModel = updateModel(memo.model, transition);
    transition = transition.set('model', newModel);
    var relevantVerifications = findByRequirement(newModel, verifications);
    var steps = memo.steps
    .push(transition)
    .push(createVerificationGroup(relevantVerifications).set('model', newModel));
    return {steps: steps, model: newModel};
  }, {steps: Immutable.List(), model: Immutable.Map()}).steps;
}


