module.exports = function scenarioBuilder(transitions, verifications) {
  function findByRequirement(model, hasRequirements) {
    return hasRequirements.filter(function(object) {
      return Object.keys(object.requires || {}).every(function(requiredKey) {
        return object.requires[requiredKey] === model[requiredKey];
      });
    });
  }

  function findTransitions(model) {
    return findByRequirement(model, transitions);
  }

  function findVerifications(model) {
    return findByRequirement(model, verifications);
  }

  function merge(a, b) {
    var result = {};
    Object.keys(a).forEach(function(key) {
      result[key] = a[key];
    });
    Object.keys(b).forEach(function(key) {
      result[key] = b[key];
    });
    return result;
  }

  return {
    build: function(dsl, systemConstructor) {
      var plan = function(context) {
        var model = {};
        var root = findTransitions(model)[0];
        var pastTransitions = {};
        var queue = [root];
        var children;

        while (queue.length > 0) {
          var transition  = queue.pop();
          console.log('transition: ' + transition.name + ' (' + JSON.stringify(transition.requires) + ' -> ' + JSON.stringify(transition.provides) + ')');
          transition.apply(context, model);
          pastTransitions[transition.name] = true;
          model = merge(model, transition.provides);
          console.log(model);
          var toVerify = findVerifications(model);
          toVerify.forEach(function(verification) {
            console.log('verify: ' + verification.name + ' ' + JSON.stringify(verification.requires));
            verification.apply(context);
          });
          children = findTransitions(model)
          .filter(function(transition) {
            return !pastTransitions.hasOwnProperty(transition.name);
          })
          .sort(function(a, b) {
            return Object.keys(b.requires || {}).length - Object.keys(a.requires || {}).length;
          });
          queue  = queue.concat(children);
        }
      }

      dsl.describe('scenario 1', function() {
        dsl.it('it', function() {
          plan(systemConstructor());
        });
      });
    }
  }
}

