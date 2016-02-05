var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var cupFixture = require(__dirname + '/../../models/cup');

var fooChainFixture = require(__dirname + '/../../models/foo_chain');

var revisit = require(__dirname + '/../../../lib/strategies/revisit_transitions/');
var strategyBehaviours = require(__dirname + '/../strategy_behaviours');
var toNames = require(__dirname + '/../../to_names');

describe('revisit_transitions strategy', function() {
  this.timeout(5000);

  it('should allow transitions where requirements satisfied by previous transition', function() {
    var testPlan = revisit(Immutable.fromJS(cupFixture.transitions), Immutable.fromJS(cupFixture.verifications));

    var testPlanNames = toNames(testPlan);

    expect(testPlanNames).to.equal(Immutable.fromJS([
      ['init', 'fill', 'pour', 'fill half', 'add 0.5'],
      ['init', 'add 0.5', 'pour', 'fill'],
      ['init', 'fill half', 'pour', 'add 0.5', 'fill'],
      ['init', 'add 0.5', 'pour', 'fill half', 'fill'],
      ['init', 'fill half', 'fill', 'pour', 'add 0.5'],
      ['init', 'fill', 'pour', 'add 0.5'],
      ['init', 'add 0.5', 'fill', 'pour', 'fill half'],
      ['init', 'fill half', 'pour', 'fill'],
      ['init', 'fill half', 'add 0.5', 'pour', 'fill']
    ]));
  });

  it('should not provide multiple permutations of the same transitions', function() {
    var testPlan = revisit(Immutable.fromJS(fooChainFixture.transitions), Immutable.fromJS(fooChainFixture.verifications));

    expect(testPlan.size).to.equal(1);
    expect(testPlan.getIn([0, 0, 'name'])).to.equal('foo');
    expect(testPlan.getIn([0, 1, 'name'])).to.equal('bar');
    expect(testPlan.getIn([0, 2, 'name'])).to.equal('baz depends on foo and bar');
  });

  strategyBehaviours(revisit);
});
