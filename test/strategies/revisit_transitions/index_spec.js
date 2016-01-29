var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var cupFixture = require(__dirname + '/../cup_fixture');
var fooChainFixture = require(__dirname + '/../foo_chain_fixture');
var revisit = require(__dirname + '/../../../lib/strategies/revisit_transitions/');
var strategyBehaviours = require(__dirname + '/../strategy_behaviours');

function toNames(testPlan) {
  return testPlan.map(function(scenario) {
    return scenario.map(function(transition) {
      return transition.get('name');
    });
  });
}

describe('revisit_transitions strategy', function() {
  this.timeout(5000);

  it('should allow transitions where requirements satisfied by previous transition', function() {
    var testPlan = revisit(cupFixture.transitions, cupFixture.verifications);

    var testPlanNames = toNames(testPlan);

    expect(testPlanNames).to.equal(Immutable.fromJS([
      ['init', 'fill', 'volume is one', 'pour', 'fill half', 'add 0.5', 'volume is one'],
      ['init', 'add 0.5', 'pour', 'fill', 'volume is one'],
      ['init', 'fill half', 'pour', 'add 0.5', 'fill', 'volume is one'],
      ['init', 'add 0.5', 'pour', 'fill half', 'fill', 'volume is one'],
      ['init', 'fill half', 'fill', 'volume is one', 'pour', 'add 0.5'],
      ['init', 'fill', 'volume is one', 'pour', 'add 0.5'],
      ['init', 'add 0.5', 'fill', 'volume is one', 'pour', 'fill half'],
      ['init', 'fill half', 'pour', 'fill', 'volume is one'],
      ['init', 'fill half', 'add 0.5', 'volume is one', 'pour', 'fill', 'volume is one']
    ]));
  });

  it('should not provide multiple permutations of the same transitions', function() {
    var testPlan = revisit(fooChainFixture.transitions, fooChainFixture.verifications);

    expect(testPlan.size).to.equal(1);
    expect(testPlan.getIn([0, 0, 'name'])).to.equal('foo');
    expect(testPlan.getIn([0, 1, 'name'])).to.equal('bar');
    expect(testPlan.getIn([0, 2, 'name'])).to.equal('baz depends on foo and bar');
  });

  strategyBehaviours(revisit);
});
