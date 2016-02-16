module.exports.transitions = [
  {
    name: 'foo',
    requires: function(state) {
      return !state.hasOwnProperty('foo');
    },
    provides: {foo: true}
  },
  {
    name: 'bar',
    requires: function(state) {
      return !state.hasOwnProperty('bar');
    },
    provides: {bar: true}
  },
  {
    name: 'baz depends on foo and bar',
    requires: function(state) {
      return state.foo && state.bar && !state.hasOwnProperty('baz');
    },
    provides: {baz: true}
  }
];

module.exports.verifications = [];
