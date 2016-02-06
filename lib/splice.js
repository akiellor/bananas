var Immutable = require('immutable');
var updateModel = require('./update_model');
var findByRequirement = require('./find_by');

module.exports = function splice(verifications, path) {
  return path.reduce(function(memo, transition) {
    var newModel = updateModel(memo.model, transition);
    transition = transition.set('model', newModel);
    var relevantVerifications = findByRequirement(newModel, verifications).map(function(verification) {
      return verification.set('model', newModel);
    });
    var steps = memo.steps
    .push(transition)
    .concat(relevantVerifications);
    return {steps: steps, model: newModel};
  }, {steps: Immutable.List(), model: Immutable.Map()}).steps;
}


