var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var brute = require(__dirname + '/../../../lib/strategies/brute');
var strategyBehaviours = require(__dirname + '/../strategy_behaviours');
var toNames = require(__dirname + '/../../to_names');

var cupFixture = require(__dirname + '/../../models/cup');

describe('brute strategy', function() {
  this.timeout(5000);

  it('should generate paths to hit all state graph edges', function() {
    var testPlan = brute(Immutable.fromJS(cupFixture.transitions));

    var testPlanNames = toNames(testPlan);

    expect(testPlanNames).to.equal(Immutable.fromJS([
      ['init', 'fill', 'pour'],
      ['init', 'add 0.5', 'fill'],
      ['init', 'add 0.5', 'add 0.5'],
      ['init', 'add 0.5', 'pour'],
      ['init', 'fill half']
    ]));
  });

  strategyBehaviours(brute);
});
