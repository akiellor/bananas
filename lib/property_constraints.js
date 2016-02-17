var Immutable = require('immutable');

var cardinality = {
  '=': function(val, count) {
    return val.length === parseInt(count);
  },
  '>': function(val, count) {
    return val.length > parseInt(count);
  },
  '<': function(val, count) {
    return val.length < parseInt(count);
  }
};

var rules = {

  hasProperty: function(model, propertyName) {
    return model.get(propertyName);
  },

  withValue: function(propertyValue, expectedValue) {
    return expectedValue === propertyValue;
  },

  withCardinality: function(propertyValue, cardinalityType) {
    var operator = cardinalityType[0];
    var count = cardinalityType.slice(1);
    return cardinality[operator].apply(undefined, [propertyValue, count]);
  },

  withSome: function(propertyValue, expectedSet) {
    return Immutable.Set(propertyValue).intersect(expectedSet).size > 0;
  },

  withAll: function(propertyValue, expectedSet) {
    return Immutable.Set(expectedSet).intersect(propertyValue).size === expectedSet.length;
  },

  withValueFrom: function(propertyValue, expectedSet) {
    return propertyValue.length === expectedSet.length && this.withAll(propertyValue, expectedSet);
  }


};

module.exports = function(constraints, model) {

  var applyConstraint = function(constraint, model) {
    var propertyName = constraint['hasProperty'];
    if (propertyName) {
      var propertyValue = rules.hasProperty(model, propertyName);
      return !!(Object.keys(constraint)
          .filter(function(key) {
            return key != 'hasProperty';
          }).reduce(function(mem, curr) {
          return mem && rules[curr].apply(rules, [propertyValue, constraint[curr]]);
        }, propertyValue));
    }
    return false;
  };

  if (constraints.length > 0) {
    var firstConstraint = constraints.pop();
    return constraints.reduce(function(mem, curr) {
      return mem && applyConstraint(curr, model);
    }, applyConstraint(firstConstraint, model));
  } else {
    return true;
  }
};
