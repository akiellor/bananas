var quick = require(__dirname + '/../../../lib/strategies/quick');
var strategyBehaviours = require(__dirname + '/../strategy_behaviours');

describe('quick strategy', function() {
  this.timeout(5000);

  strategyBehaviours(quick);
});
