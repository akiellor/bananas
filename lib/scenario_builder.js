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
    graph:[],
    build: function(dsl, systemConstructor) {
      var plan = function(context) {
        var model = {};
        var root = findTransitions(model)[0];
        var pastTransitions = {};
        var queue = [root];
        var children;
        this.graph = [];

        while (queue.length > 0) {
          var transition = queue.shift();
          console.log('transition: ' + transition.name + ' (' + JSON.stringify(transition.requires) + ' -> ' + JSON.stringify(transition.provides) + ')');
          transition.apply(context, model);
          pastTransitions[transition.name] = true;
          model = merge(model, transition.provides);
          console.log(model);
          var status = {status: "Success"};
          var toVerify = findVerifications(model);
          try {
            toVerify.forEach(function(verification) {
              console.log('verify: ' + verification.name + ' ' + JSON.stringify(verification.requires));
              verification.apply(context);
            });
          } catch (assertionErrors) {
            status = {status: "Error", errorMessage: assertionErrors.toString()};
          }
          children = findTransitions(model)
          .filter(function(transition) {
            return !pastTransitions.hasOwnProperty(transition.name);
          })
          .sort(function(a, b) {
            return Object.keys(b.requires || {}).length - Object.keys(a.requires || {}).length;
          });
          transition = merge(transition, {status: status, children: children});
          this.graph.push(transition);
          queue = queue.concat(children);
        }
      }

      dsl.describe('scenario 1', function() {
        dsl.it('it', function() {
          plan(systemConstructor());
        });
      });
    }
  };
}

