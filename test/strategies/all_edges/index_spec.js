var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var allEdges = require(__dirname + '/../../../lib/strategies/all_edges/');
var strategyBehaviours = require(__dirname + '/../strategy_behaviours');
var toNames = require(__dirname + '/../../to_names');

var cupFixture = require(__dirname + '/../../models/cup');

describe('all edges strategy', function() {
  this.timeout(5000);

  it('should ', function() {
    var testPlan = allEdges(Immutable.fromJS(cupFixture.transitions), Immutable.fromJS(cupFixture.verifications));

    var testPlanNames = toNames(testPlan);

    expect(testPlanNames).to.equal(Immutable.fromJS([
      ['init', 'fill', 'pour'],
      ['init', 'add 0.5', 'fill'],
      ['init', 'add 0.5', 'add 0.5'],
      ['init', 'add 0.5', 'pour'],
      ['init', 'fill half']
    ]));
  });

  strategyBehaviours(allEdges);
});
