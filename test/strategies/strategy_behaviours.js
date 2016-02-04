var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var findByRequirement = require(__dirname + '/../../lib/find_by');
var updateModel = require(__dirname + '/../../lib/update_model');
var toNames = require(__dirname + '/../to_names');

var cupFixture = {
  transitions: require(__dirname + '/../fixtures/cup_transitions'),
  verifications: require(__dirname + '/../fixtures/cup_verifications')
};

var fooChainFixture = {
  transitions: require(__dirname + '/../fixtures/foo_chain_transitions'),
  verifications: require(__dirname + '/../fixtures/foo_chain_verifications')
}

var bitFlipFixture = {
  transitions: require(__dirname + '/../fixtures/bit_flip_transitions'),
  verifications: require(__dirname + '/../fixtures/bit_flip_verifications')
}

module.exports = function strategyBehaviours(strategy) {
  [cupFixture, fooChainFixture, bitFlipFixture].forEach(function(fixture, i) {
    it('should always satisfy requirements of transitions ' + i, function() {
      var testPlan = strategy(fixture.transitions, fixture.verifications);

      testPlan.forEach(function(scenario) {
        var model = Immutable.Map({});

        scenario.forEach(function(transition) {
          var found = findByRequirement(model, Immutable.List([transition]));
          expect(found.size).to.equal(1);
          model = updateModel(model, transition);
        });
      });
    });
  });
};
