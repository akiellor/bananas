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
]

describe('systems', function() {
  fixtures.forEach(function(fixture) {
    describe(fixture.name, function() {
      var testPlan = createTestPlan(fixture.model.transitions, fixture.model.verifications);
      testPlan.forEach(function(test) {
        it(test.name, function() {
          test.apply(fixture.system());
        });
      });
    });
  });
});

