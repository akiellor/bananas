var Immutable = require('immutable');

var cardinality = {
  '=': function(val, count) {
    return val.size === parseInt(count);
  },
  '>': function(val, count) {
    return val.size > parseInt(count);
  },
  '<': function(val, count) {
    return val.size < parseInt(count);
  }
};

var handleFunctionParameter = function(expectedSet, propertyValue) {
  if (typeof (expectedSet) === 'function' && Array.isArray(propertyValue)) {
    return propertyValue.filter(expectedSet);
  }
  return expectedSet;
};

var rules = {

  hasProperty: function(model, propertyName) {
    return model.get(propertyName);
  },

  withValue: function(propertyValue, expectedValue) {
    return expectedValue === propertyValue;
  },

  withNotValue: function(propertyValue, expectedValue) {
    return expectedValue != propertyValue;
  },

  withCardinality: function(propertyValue, cardinalityType) {
    var operator = cardinalityType[0];
    var count = cardinalityType.slice(1);
    return cardinality[operator].apply(undefined, [propertyValue, count]);
  },

  withSome: function(propertyValue, expectedSet) {
    expectedSet = handleFunctionParameter(expectedSet, propertyValue);
    return Immutable.Set(propertyValue).intersect(expectedSet).size > 0;
  },
  withNone: function(propertyValue, expectedSet) {
    expectedSet = handleFunctionParameter(expectedSet, propertyValue);
    return Immutable.Set(propertyValue).intersect(expectedSet).size === 0;
  },

  withAll: function(propertyValue, expectedSet) {
    expectedSet = handleFunctionParameter(expectedSet, propertyValue);
    return Immutable.Set(expectedSet).intersect(propertyValue).size === expectedSet.size;
  },

  withValueFrom: function(propertyValue, expectedSet) {
    expectedSet = handleFunctionParameter(expectedSet, propertyValue);
    return propertyValue.length === expectedSet.size && this.withAll(propertyValue, expectedSet);
  }


};

module.exports = function(constraints, model) {

  var applyConstraint = function(constraint, model) {
    if (constraint.get('hasNoProperty')) {
      return !!!rules.hasProperty(model, constraint.get('hasNoProperty'));
    }
    var propertyName = constraint.get('hasProperty');
    if (propertyName) {
      var propertyValue = rules.hasProperty(model, propertyName);
      var keys = constraint.keySeq().toArray()
        .filter(function(key) {
          return key !== 'hasProperty';
        });
      return !!(keys.reduce(function(mem, curr) {
          return mem && rules[curr].apply(rules, [propertyValue, constraint.get(curr)]);
        }, propertyValue));
    }
    return false;
  };


  if (constraints.size > 0) {
    return constraints.slice(1).reduce(function(mem, curr) {
      return mem && applyConstraint(curr, model);
    }, applyConstraint(constraints.first(), model));
  } else {
    return true;
  }
};
