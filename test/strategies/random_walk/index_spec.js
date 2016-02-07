var randomWalk = require(__dirname + '/../../../lib/strategies/random_walk');
var strategyBehaviours = require(__dirname + '/../strategy_behaviours');

describe('random walk strategy', function() {
  this.timeout(5000);

  strategyBehaviours(randomWalk);
});
