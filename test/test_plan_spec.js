var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var cupFixture = require(__dirname + '/models/cup');

var createTestPlan = require(__dirname + '/../lib/test_plan');

describe('test plan', function() {
  it('should generate test hash identifiers based on the step names', function() {
    var testPlan = createTestPlan(cupFixture, function(transitions) {
      return Immutable.List([
        Immutable.List([transitions.get(0), transitions.get(2)])
      ]);
    });

    var names = testPlan.map(function(scenario) {
      return scenario.name;
    });

    expect(names).to.deep.equal(['af5f5']);
  });
});
