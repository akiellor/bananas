var scenarioBuilder = require(__dirname + '/../lib/scenario_builder');
var revisitTransitionsStrategy = require(__dirname + '/../lib/strategies/revisit_transitions');

function sut() {
  var state = [false, false, false];

  return {
    flip: function(index) {
      state[index] = !state[index];
    },
    _state: state
  };
}

var transitions = require('./transitions');
var verifications = require('./verifications'); 

var builder = scenarioBuilder(transitions, verifications, revisitTransitionsStrategy);
builder.build(function(testPlan) {
  it(testPlan.name, function() {
    testPlan.apply(sut());
  });
});
