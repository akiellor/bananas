var createTestPlan = require(__dirname + '/../lib/test_plan');

var fixtures = [
  {
    name: 'bit_flip',
    system: require('./systems/bit_flip'),
    model: require('./models/bit_flip')
  },
  {
    name: 'cup',
    system: require('./systems/cup'),
    model: require('./models/cup')
  }
];

var strategies = [
  require(__dirname + '/../lib/strategies/brute'),
  require(__dirname + '/../lib/strategies/quick')
];

describe('systems', function() {
  strategies.forEach(function(strategy) {
    describe(strategy.name, function() {
      fixtures.forEach(function(fixture) {
        var testPlan = createTestPlan(fixture.model, strategy);

        describe(fixture.name + ' (' + testPlan.length + ')', function() {
          testPlan.forEach(function(test) {
            it(test.name, function() {
              test.apply(fixture.system());
            });
          });
        });
      });
    });
  });
});

