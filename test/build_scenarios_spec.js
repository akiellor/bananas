var Immutable = require('immutable');
var expect = require('chai').expect;
var buildScenarios = require(__dirname + '/../lib/build_scenarios');

describe('build test plans', function() {
  function createNodes(size) {
    function createNode(i) {
      return {name: String(i)};
    }
    var i = 0;
    return Immutable.fromJS(Array(size + 1).join().split('').map(function(){return createNode(i++);}));
  }

  it("should build no plans", function() {
    var scenarios = buildScenarios(
      Immutable.fromJS([]),
      Immutable.fromJS({}),
      Immutable.List()
    );

    expect(scenarios.size).to.equal(0);
  });

  it("should build for non-cyclical graph", function() {
    var nodes = createNodes(5)
    var graph = Immutable.fromJS({
      '0': ['1', '3'],
      '1': ['3'],
      '3': ['4'],
      '4': ['1', '2']
    });
    var roots = Immutable.List(['0']);

    var scenarios = buildScenarios(nodes, graph, roots);

    expect(scenarios.getIn([0, 0])).to.equal(nodes.get(0));
    expect(scenarios.getIn([0, 1])).to.equal(nodes.get(1));
    expect(scenarios.getIn([0, 2])).to.equal(nodes.get(3));
    expect(scenarios.getIn([0, 3])).to.equal(nodes.get(4));

    expect(scenarios.getIn([1, 0])).to.equal(nodes.get(0));
    expect(scenarios.getIn([1, 1])).to.equal(nodes.get(1));
    expect(scenarios.getIn([1, 2])).to.equal(nodes.get(3));
    expect(scenarios.getIn([1, 3])).to.equal(nodes.get(4));
    expect(scenarios.getIn([1, 4])).to.equal(nodes.get(2));

    expect(scenarios.getIn([2, 0])).to.equal(nodes.get(0));
    expect(scenarios.getIn([2, 1])).to.equal(nodes.get(3));
    expect(scenarios.getIn([2, 2])).to.equal(nodes.get(4));
    expect(scenarios.getIn([2, 3])).to.equal(nodes.get(1));

    expect(scenarios.getIn([3, 0])).to.equal(nodes.get(0));
    expect(scenarios.getIn([3, 1])).to.equal(nodes.get(3));
    expect(scenarios.getIn([3, 2])).to.equal(nodes.get(4));
    expect(scenarios.getIn([3, 3])).to.equal(nodes.get(2));
  });

  it("should build for graph that cycles to root", function() {
    var nodes = createNodes(2)
    var graph = Immutable.fromJS({
      '0': ['1'],
      '1': ['0']
    });
    var roots = Immutable.List(['0']);

    var scenarios = buildScenarios(nodes, graph, roots);

    expect(scenarios.getIn([0, 0])).to.equal(nodes.get(0));
    expect(scenarios.getIn([0, 1])).to.equal(nodes.get(1));
  });

  it("should build for graph with multiple roots", function() {
    var nodes = createNodes(2)
    var graph = Immutable.fromJS({});
    var roots = Immutable.List(['0', '1']);

    var scenarios = buildScenarios(nodes, graph, roots);

    expect(scenarios.getIn([0, 0])).to.equal(nodes.get(0));
    expect(scenarios.getIn([1, 0])).to.equal(nodes.get(1));
  });
});

