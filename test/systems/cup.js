module.exports = function() {
  var volume = 0;

  return {
    add: function(amount) {
      volume += amount
    },
    pour: function() {
      volume = 0;
    },
    fill: function() {
      volume = 1;
    },
    isFull: function() {
      return volume === 1;
    }
  }
}
