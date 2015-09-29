var Immutable = require('immutable');
var buildGraph = require(__dirname + '/../lib/build_graph');
var chai = require('chai');
var expect = chai.expect
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);

describe('build graph', function() {
  it('should', function() {
    var transitions = Immutable.fromJS([
      {
        name: 'push empty',
        requires: function(model) {
          return !model.hasOwnProperty('full');
        },
        provides: {full: true},
        apply: function(system) {
          system.push(1);
        }
      },
      {
        name: 'pop',
        requires: {full: true},
        provides: {full: false},
        apply: function(system) {
          system.pop();
        }
      }
    ]);

    var graph = buildGraph(transitions);

    expect(graph).to.equal(Immutable.fromJS({
      'push empty': ['pop'],
      'pop': []
    }));
  });

  it('should build a graph defined with predicates', function() {
    var transitions = Immutable.fromJS([
      {
        name: 'push empty',
        requires: function(model) {
          return !model.hasOwnProperty('full');
        },
        provides: {full: true},
        apply: function(system) {
          system.push(1);
        }
      },
      {
        name: 'pop',
        requires: function(model) {
          return model.full;
        },
        provides: {full: false},
        apply: function(system) {
          system.pop();
        }
      }
    ]);

    var graph = buildGraph(transitions);

    expect(graph).to.equal(Immutable.fromJS({
      'push empty': ['pop'],
      'pop': []
    }));
  });
});
