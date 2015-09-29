var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var newStrategy = require(__dirname + '/../../lib/strategies/new');

describe('new strategy', function() {
  it('should allow transitions where requirements satisfied by previous transition', function() {
    var transitions = Immutable.fromJS([
      {
        name: 'init',
        requires: function(model) {
          return !model.hasOwnProperty('volume');
        },
        provides: {volume: 0}
      },
      {
        name: 'pour',
        requires: function(model) {
          return model.volume > 0;
        },
        provides: {volume: 0}
      },
      {
        name: 'fill half',
        requires: function(model) {
          return model.volume === 0;
        },
        provides: {volume: 0.5}
      },
      {
        name: 'fill',
        requires: function(model) {
          return model.volume < 1;
        },
        provides: {volume: 1}
      }
    ]);

    var verifications = Immutable.fromJS([
      {
        name: 'volume is one',
        requires: {volume: 1}
      }
    ]);

    var testPlan = newStrategy(transitions, verifications);

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
});
