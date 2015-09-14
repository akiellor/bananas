var buildGraph = require(__dirname + '/../lib/build_graph');
var expect = require('chai').expect;

describe('build graph', function() {
  it('should', function() {
    var transitions = [
      {
        name: 'push empty',
        requires: {full: undefined},
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
    ];

    var graph = buildGraph(transitions);

    expect(graph.length).to.equal(1);
    expect(graph[0].name).to.equal('push empty');
    expect(graph[0].children.length).to.equal(1);
    expect(graph[0].children[0].name).to.equal('pop');
  });

  it('should build a graph defined with predicates', function() {
    var transitions = [
      {
        name: 'push empty',
        requires: {full: undefined},
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
    ];

    var graph = buildGraph(transitions);

    expect(graph.length).to.equal(1);
    expect(graph[0].name).to.equal('push empty');
    expect(graph[0].children.length).to.equal(1);
    expect(graph[0].children[0].name).to.equal('pop');
  });
});
