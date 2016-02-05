module.exports.transitions = [
  {
    name: 'init',
    requires: function(model) {
      return !model.hasOwnProperty('volume');
    },
    provides: {volume: 0}
  },
  {
    name: 'pour',
    requires: function(model) {
      return model.volume > 0;
    },
    provides: {volume: 0}
  },
  {
    name: 'fill half',
    requires: function(model) {
      return model.volume === 0;
    },
    provides: {volume: 0.5}
  },
  {
    name: 'add 0.5',
    requires: function(model) {
      return model.volume !== undefined && model.volume !== 1;
    },
    provides: function(model) {
      model.volume = model.volume + 0.5;
      return model;
    }
  },
  {
    name: 'fill',
    requires: function(model) {
      return model.volume < 1;
    },
    provides: {volume: 1}
  }
];

module.exports.verifications = [
  {
    name: 'volume is one',
    requires: {volume: 1}
  }
];

