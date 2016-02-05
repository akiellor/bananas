function noProp(name) {
  return function(model) {
    return !model.hasOwnProperty(name);
  };
}

module.exports = [
  {
    name: 'init',
    requires: function(model) {
      return !model.hasOwnProperty('first') && !model.hasOwnProperty('second') && !model.hasOwnProperty('third');
    },
    provides: {first: 0, second: 0, third: 0},
    apply: function() {}
  },
  {
    name: 'flip 0 from 1',
    requires: {first: 1},
    provides: {first: 0},
    apply: function(system) {
      system.flip(0);
    }
  },
  {
    name: 'flip 0 from 0',
    requires: {first: 0},
    provides: {first: 1},
    apply: function(system) {
      system.flip(0);
    }
  },
  {
    name: 'flip 1 from 1',
    requires: {second: 1},
    provides: {second: 0},
    apply: function(system) {
      system.flip(1);
    }
  },
  {
    name: 'flip 1 from 0',
    requires: {second: 0},
    provides: {second: 1},
    apply: function(system) {
      system.flip(1);
    }
  },
  {
    name: 'flip 2 from 1',
    requires: {third: 1},
    provides: {third: 0},
    apply: function(system) {
      system.flip(2);
    }
  },
  {
    name: 'flip 2 from 0',
    requires: {third: 0},
    provides: {third: 1},
    apply: function(system) {
      system.flip(2);
    }
  }
];
