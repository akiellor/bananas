module.exports = function findByRequirement(model, hasRequirements) {
  return hasRequirements.filter(function(object) {
    return Object.keys(object.requires || {}).every(function(requiredKey) {
      return object.requires[requiredKey] === model[requiredKey];
    });
  });
}
