var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var quick = require(__dirname + '/../../../lib/strategies/quick');
var strategyBehaviours = require(__dirname + '/../strategy_behaviours');
var toNames = require(__dirname + '/../../to_names');
var cupFixture = require(__dirname + '/../../models/cup');

describe('quick strategy', function() {
  this.timeout(5000);

  it('should generate path deterministically with seed', function() {
    var testPlan = quick(Immutable.fromJS(cupFixture.transitions), {seed: 0});

    var testPlanNames = toNames(testPlan);

    expect(testPlanNames).to.equal(Immutable.fromJS([
      ['init', 'fill', 'pour', 'add 0.5', 'fill']
    ]));
  });

  strategyBehaviours(quick);
});
