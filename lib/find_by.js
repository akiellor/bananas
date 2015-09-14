module.exports = function findByRequirement(model, hasRequirements) {
  return hasRequirements.filter(function(object) {
    if (typeof object.requires === 'function') {
      return object.requires(model);
    } else {
      return Object.keys(object.requires || {}).every(function(requiredKey) {
        return object.requires[requiredKey] === model[requiredKey];
      });
    }
  });
}
