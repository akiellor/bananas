var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var findByRequirement = require(__dirname + '/../../lib/find_by');
var updateState = require(__dirname + '/../../lib/update_state');
var toNames = require(__dirname + '/../to_names');

var cupFixture = require(__dirname + '/../models/cup');

var fooChainFixture = require(__dirname + '/../models/foo_chain');

var bitFlipFixture = require(__dirname + '/../models/bit_flip');

var todoMvcFixture = require(__dirname + '/../models/todomvc');

module.exports = function strategyBehaviours(strategy) {
  [cupFixture, fooChainFixture, bitFlipFixture, todoMvcFixture].forEach(function(fixture, i) {
    it('should always satisfy requirements of transitions ' + i, function() {
      var testPlan = strategy(Immutable.fromJS(fixture.transitions), Immutable.fromJS(fixture.verifications));

      testPlan.forEach(function(scenario) {
        var state = Immutable.Map({});

        scenario.forEach(function(transition) {
          var found = findByRequirement(state, Immutable.List([transition]));
          expect(found.size).to.equal(1);
          state = updateState(state, transition);
        });
      });
    });
  });
};
