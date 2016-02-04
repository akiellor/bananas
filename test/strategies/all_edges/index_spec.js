var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var allEdges = require(__dirname + '/../../../lib/strategies/all_edges/');
var strategyBehaviours = require(__dirname + '/../strategy_behaviours');

describe('hit_states strategy', function() {
  this.timeout(5000);

  strategyBehaviours(allEdges);
});
