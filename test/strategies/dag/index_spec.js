var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var strategyBehaviours = require(__dirname + '/../strategy_behaviours');
var cupFixture = require(__dirname + '/../cup_fixture');
var directed_acyclic_graph = require(__dirname + '/../../../lib/strategies/dag/');

describe('create a directed acyclic graph from the states', function() {

  it('should allow transitions where requirements satisfied by previous transition', function() {
    var testPlan = directed_acyclic_graph(cupFixture.transitions, cupFixture.verifications);

    expect(testPlan.size).to.equal(1);

    var steps = testPlan.get(0);

    expect(steps.getIn([0, 'name'])).to.equal('init');
    expect(steps.getIn([1, 'name'])).to.equal('fill half');
    expect(steps.getIn([2, 'name'])).to.equal('fill');
    expect(steps.getIn([3, 'name'])).to.equal('volume is one');
    expect(steps.getIn([4, 'name'])).to.equal('pour');
  });

  strategyBehaviours(directed_acyclic_graph);
});
