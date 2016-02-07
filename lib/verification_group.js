var Immutable = require('immutable');

module.exports = function createVerificationGroup(verifications) {
  var name = verifications
    .map(function(v) { return '\'' + v.get('name') + '\''; })
    .join(', ');

  return Immutable.Map({
    name: 'group(' + name + ')',
    apply: function(system) {
      var errors = verifications
        .map(function(verification) {
          try {
            verification.get('apply')(system);
          } catch (e) {
            return {
              verification: verification.toJS(),
              error: e
            }
          }
        })
        .filter(function(r) { return r })
        .toJS();

      if (errors.length === 1) {
        throw errors[0].error;
      } else if (errors.length > 1) {
        var error = new Error(errors.map(function(e) { return e.verification.name + ': ' + e.error.message; }).join('\n'));
        error.errors = errors;
        throw error;
      }
    }
  });
}
