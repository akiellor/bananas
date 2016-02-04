module.exports = [
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
      return model.foo && model.bar && !model.hasOwnProperty('baz');
    },
    provides: {baz: true}
  }
];

