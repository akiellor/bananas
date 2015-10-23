var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var cupFixture = require(__dirname + '/strategies/cup_fixture');
var scenarioBuilder = require(__dirname + '/../lib/scenario_builder');

describe('scenario builder', function() {
  it('should generate test hash identifiers based on the step names', function() {
    var builder = scenarioBuilder(cupFixture.transitions, cupFixture.verifications, function(transitions, verifications) {
      return Immutable.List([
        Immutable.Map({steps: Immutable.List([transitions.get(0), transitions.get(2)])})
      ]);
    });

    var names = [];
    builder.build(function(scenario) { names.push(scenario.name); });

    expect(names).to.deep.equal(['334e0']);
  });
});
