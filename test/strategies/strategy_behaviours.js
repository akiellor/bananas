var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var findByRequirement = require(__dirname + '/../../lib/find_by');
var cupFixture = require(__dirname + '/cup_fixture');
var fooChainFixture = require(__dirname + '/foo_chain_fixture');
var bitFlipFixture = require(__dirname + '/bit_flip_fixture');

module.exports = function strategyBehaviours(strategy) {
  [cupFixture, fooChainFixture, bitFlipFixture].forEach(function(fixture, i) {
    it('should always satisfy requirements of transitions ' + i, function() {
      var testPlan = strategy(fixture.transitions, fixture.verifications);

      testPlan.forEach(function(scenario) {
        var steps = scenario.get('steps');
        var model = Immutable.Map({});

        steps.forEach(function(transition) {
          var found = findByRequirement(model, Immutable.List([transition]));
          expect(found.size).to.equal(1);
          model = model.merge(transition.get('provides'));
        });
      });
    });
  });
};
