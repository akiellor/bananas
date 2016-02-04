function noProp(name) {
  return function(model) {
    return !model.hasOwnProperty(name);
  };
}

module.exports = [
  {
    name: 'flip 0 from initial',
    requires: noProp('first'),
    provides: {first: 1},
    apply: function(system) {
      system.flip(0);
    }
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
    name: 'flip 1 from initial',
    requires: noProp('second'),
    provides: {second: 1},
    apply: function(system) {
      system.flip(1);
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
    name: 'flip 2 from initial',
    requires: noProp('third'),
    provides: {third: 1},
    apply: function(system) {
      system.flip(2);
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
