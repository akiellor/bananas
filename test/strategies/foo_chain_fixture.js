var Immutable = require('immutable');

var transitions = Immutable.fromJS([
  {
    name: 'foo',
    requires: function(model) {
      return !model.hasOwnProperty('foo');
    },
    provides: {foo: true}
  },
  {
    name: 'bar',
    requires: function(model) {
      return !model.hasOwnProperty('bar');
    },
    provides: {bar: true}
  },
  {
    name: 'baz depends on foo and bar',
    requires: function(model) {
      return model.foo && model.bar;
    },
    provides: {baz: true}
  }
]);

var verifications = Immutable.fromJS([]);

var Immutable = require('immutable');

module.exports = {
  transitions: transitions,
  verifications: verifications
};
