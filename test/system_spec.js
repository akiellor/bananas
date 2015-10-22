var scenarioBuilder = require(__dirname + '/../lib/scenario_builder');

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

var builder = scenarioBuilder(transitions, verifications);
builder.build(function(testPlan) {
  it(testPlan.name, function() {
    testPlan.apply(sut());
  });
});

builder = scenarioBuilder(transitions, verifications,"dag");
builder.build(function(testPlan) {
  it(testPlan.name, function() {
    testPlan.apply(sut());
  });
});
