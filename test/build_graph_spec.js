var buildGraph = require(__dirname + '/../lib/build_graph');
var expect = require('chai').expect;

describe('build graph', function() {
  it('should', function() {
    var transitions = [
      {
        name: 'push empty',
        requires: {},
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

    expect(graph.length).to.equal(2);
    expect(graph[0].name).to.equal('push empty');
    expect(graph[0].children.length).to.equal(1);
    expect(graph[0].children[0].name).to.equal('pop');
    expect(graph[1].name).to.equal('pop');
    expect(graph[1].children.length).to.equal(0);
  });
});
