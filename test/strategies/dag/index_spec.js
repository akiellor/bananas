var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var directed_acyclic_graph = require(__dirname + '/../../../lib/strategies/dag/');

describe('create a directed acyclic graph from the states', function() {
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

    var testPlan = directed_acyclic_graph(transitions, verifications);

    expect(testPlan.size).to.equal(1);

    var steps = testPlan.get(0).get("steps");

    expect(steps.getIn([0, 'name'])).to.equal('init');
    expect(steps.getIn([1, 'name'])).to.equal('fill half');
    expect(steps.getIn([2, 'name'])).to.equal('fill');
    expect(steps.getIn([3, 'name'])).to.equal('volume is one');
    expect(steps.getIn([4, 'name'])).to.equal('pour');
  });

});
