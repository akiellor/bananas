var Immutable = require('immutable');

function verify(system, state, verification) {
  try {
    verification.get('apply')(system, state);
  } catch (e) {
    return {
      verification: verification.toJS(),
      error: e
    }
  }
}

function name(verifications) {
  var name = verifications
    .map(function(v) { return '\'' + v.get('name') + '\''; })
    .join(', ');

  return 'group(' + name + ')';
}

module.exports = function createVerificationGroup(verifications) {
  return Immutable.Map({
    name: name(verifications),
    apply: function(system, state) {
      var errors = verifications
        .map(verify.bind(null, system, state))
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
