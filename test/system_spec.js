var createTestPlan = require(__dirname + '/../lib/test_plan');

function sut() {
  var state = [false, false, false];

  return {
    flip: function(index) {
      state[index] = !state[index];
    },
    _state: state
  };
}

var transitions = require('./models/bit_flip').transitions;
var verifications = require('./models/bit_flip').verifications; 

var testPlan = createTestPlan(transitions, verifications);
testPlan.forEach(function(test) {
  it(test.name, function() {
    test.apply(sut());
  });
});
