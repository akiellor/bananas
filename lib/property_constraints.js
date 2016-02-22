var Immutable = require('immutable');

function not(fn) {
  return function(state) {
    return !fn(state);
  };
}

function and() {
  var fns = Array.prototype.slice.call(arguments);
  return function(state) {
    return fns.reduce(function(memo, fn) {
      return memo && fn(state);
    }, true);
  };
}


var constraint = function() {
  var fns = Array.prototype.slice.call(arguments);
  return function(state) {
    return fns.reduce(function(previousValue, fn) {
      return (!!previousValue) && fn(previousValue);
    }, state);
  };
};


var hasProperty = function(propertyName) {
  return function(state) {
    return state.hasOwnProperty(propertyName) && !!state[propertyName];
  };
};

var get = function(attrName) {
  return function(state) {
    return state[attrName];
  };
};

var getIn = function() {
  var attrs = Array.prototype.slice.call(arguments);
  return function(state) {
    return Immutable.fromJS(state).getIn(attrs);
  };
};

var getSize = function() {
  return function(state) {
    return state ? state.length : 0;
  };
};


function eq(value) {
  return function(other) {
    return other === value;
  };
}

function gt(value) {
  return function(other) {
    return other > value;
  };
}

function lt(value) {
  return function(other) {
    return other < value;
  };
}

function filterWith(pred) {
  return function(list) {
    return list.filter(pred).length > 0;
  };
}

function withSome(value) {
  return function(list) {
    return Immutable.Set(list).intersect(value).size > 0;
  };
}


function withAll(value) {
  return function(list) {
    return Immutable.Set(list).intersect(value).size === value.length;
  };
}

function isEmpty() {
  return function(list) {
    return list.length === 0;
  };
}

var rules = {
  constraint: constraint,
  eq: eq,
  gt: gt,
  lt: lt,
  and: and,
  not: not,
  hasProperty: hasProperty,
  get: get,
  getIn: getIn,
  filterWith: filterWith,
  withSome: withSome,
  withAll: withAll,
  isEmpty: isEmpty
};

module.exports = function(fn) {
  return fn.apply(rules);
};
