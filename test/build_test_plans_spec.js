var Immutable = require('immutable');
var expect = require('chai').expect;
var buildTestPlans = require(__dirname + '/../lib/build_test_plans');

describe('build test plans', function() {
  function createNodes(size) {
    function createNode(i) {
      return {name: String(i)};
    }
    var i = 0;
    return Immutable.fromJS(Array(size + 1).join().split('').map(function(){return createNode(i++);}));
  }

  it("should build no plans", function() {
    var testPlans = buildTestPlans(
      Immutable.fromJS([]),
      Immutable.fromJS({}),
      Immutable.List()
    );

    expect(testPlans.size).to.equal(0);
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

    var testPlans = buildTestPlans(nodes, graph, roots);

    expect(testPlans.getIn([0, 0])).to.equal(nodes.get(0));
    expect(testPlans.getIn([0, 1])).to.equal(nodes.get(1));
    expect(testPlans.getIn([0, 2])).to.equal(nodes.get(3));
    expect(testPlans.getIn([0, 3])).to.equal(nodes.get(4));

    expect(testPlans.getIn([1, 0])).to.equal(nodes.get(0));
    expect(testPlans.getIn([1, 1])).to.equal(nodes.get(1));
    expect(testPlans.getIn([1, 2])).to.equal(nodes.get(3));
    expect(testPlans.getIn([1, 3])).to.equal(nodes.get(4));
    expect(testPlans.getIn([1, 4])).to.equal(nodes.get(2));

    expect(testPlans.getIn([2, 0])).to.equal(nodes.get(0));
    expect(testPlans.getIn([2, 1])).to.equal(nodes.get(3));
    expect(testPlans.getIn([2, 2])).to.equal(nodes.get(4));
    expect(testPlans.getIn([2, 3])).to.equal(nodes.get(1));

    expect(testPlans.getIn([3, 0])).to.equal(nodes.get(0));
    expect(testPlans.getIn([3, 1])).to.equal(nodes.get(3));
    expect(testPlans.getIn([3, 2])).to.equal(nodes.get(4));
    expect(testPlans.getIn([3, 3])).to.equal(nodes.get(2));
  });

  it("should build for graph that cycles to root", function() {
    var nodes = createNodes(2)
    var graph = Immutable.fromJS({
      '0': ['1'],
      '1': ['0']
    });
    var roots = Immutable.List(['0']);

    var testPlans = buildTestPlans(nodes, graph, roots);

    expect(testPlans.getIn([0, 0])).to.equal(nodes.get(0));
    expect(testPlans.getIn([0, 1])).to.equal(nodes.get(1));
  });

  it("should build for graph with multiple roots", function() {
    var nodes = createNodes(2)
    var graph = Immutable.fromJS({});
    var roots = Immutable.List(['0', '1']);

    var testPlans = buildTestPlans(nodes, graph, roots);

    expect(testPlans.getIn([0, 0])).to.equal(nodes.get(0));
    expect(testPlans.getIn([1, 0])).to.equal(nodes.get(1));
  });
});

