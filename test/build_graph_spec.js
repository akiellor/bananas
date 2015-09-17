var Immutable = require('immutable');
var buildGraph = require(__dirname + '/../lib/build_graph');
var expect = require('chai').expect;

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

    expect(graph.size).to.equal(1);
    expect(graph.get(0).get('name')).to.equal('push empty');
    expect(graph.get(0).get('children').size).to.equal(1);
    expect(graph.get(0).get('children').get(0).get('name')).to.equal('pop');
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

    expect(graph.size).to.equal(1);
    expect(graph.get(0).get('name')).to.equal('push empty');
    expect(graph.get(0).get('children').size).to.equal(1);
    expect(graph.get(0).get('children').get(0).get('name')).to.equal('pop');
  });
});
