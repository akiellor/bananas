var createTestPlan = require(__dirname + '/../lib/test_plan');
var bitFlipSystem = require('./systems/bit_flip');

var transitions = require('./models/bit_flip').transitions;
var verifications = require('./models/bit_flip').verifications; 

var testPlan = createTestPlan(transitions, verifications);
testPlan.forEach(function(test) {
  it(test.name, function() {
    test.apply(bitFlipSystem());
  });
});
