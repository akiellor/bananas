var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var cupFixture = require(__dirname + '/../cup_fixture');
var fooChainFixture = require(__dirname + '/../foo_chain_fixture');
var newStrategy = require(__dirname + '/../../../lib/strategies/revisit_transitions/');

describe('revisit_transitions strategy', function() {
  it('should allow transitions where requirements satisfied by previous transition', function() {
    var testPlan = newStrategy(cupFixture.transitions, cupFixture.verifications);

    expect(testPlan.size).to.equal(3);

    expect(testPlan.getIn([0, 'name'])).to.equal('0');
    expect(testPlan.getIn([0, 'steps', 0, 'name'])).to.equal('init');
    expect(testPlan.getIn([0, 'steps', 1, 'name'])).to.equal('fill half');
    expect(testPlan.getIn([0, 'steps', 2, 'name'])).to.equal('pour');
    expect(testPlan.getIn([0, 'steps', 3, 'name'])).to.equal('fill');
    expect(testPlan.getIn([0, 'steps', 4, 'name'])).to.equal('volume is one');

    expect(testPlan.getIn([1, 'name'])).to.equal('1');
    expect(testPlan.getIn([1, 'steps', 0, 'name'])).to.equal('init');
    expect(testPlan.getIn([1, 'steps', 1, 'name'])).to.equal('fill half');
    expect(testPlan.getIn([1, 'steps', 2, 'name'])).to.equal('fill');
    expect(testPlan.getIn([1, 'steps', 3, 'name'])).to.equal('volume is one');
    expect(testPlan.getIn([1, 'steps', 4, 'name'])).to.equal('pour');

    expect(testPlan.getIn([2, 'name'])).to.equal('2');
    expect(testPlan.getIn([2, 'steps', 0, 'name'])).to.equal('init');
    expect(testPlan.getIn([2, 'steps', 1, 'name'])).to.equal('fill');
    expect(testPlan.getIn([2, 'steps', 2, 'name'])).to.equal('volume is one');
    expect(testPlan.getIn([2, 'steps', 3, 'name'])).to.equal('pour');
    expect(testPlan.getIn([2, 'steps', 4, 'name'])).to.equal('fill half');
  });

  it('should not provide multiple permutations of the same transitions', function() {
    var testPlan = newStrategy(fooChainFixture.transitions, fooChainFixture.verifications);

    expect(testPlan.size).to.equal(1);
    expect(testPlan.getIn([0, 'name'])).to.equal('0');
    expect(testPlan.getIn([0, 'steps', 0, 'name'])).to.equal('foo');
    expect(testPlan.getIn([0, 'steps', 1, 'name'])).to.equal('bar');
    expect(testPlan.getIn([0, 'steps', 2, 'name'])).to.equal('baz depends on foo and bar');
  });
});
