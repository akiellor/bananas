var expect = require('chai').expect;
var buildTestPlans = require(__dirname + '/../lib/build_test_plans');

describe('build test plans', function() {
  function createNodes(size) {
    function createNode(i) {
      return {name: String(i)};
    }
    var i = 0;
    return Array(size + 1).join().split('').map(function(){return createNode(i++);});
  }

  it("should build no plans", function() {
    var testPlans = buildTestPlans([]);

    expect(testPlans).to.deep.equal([]);
  });

  it("should build for non-cyclical graph", function() {
    var nodes = createNodes(5)
    nodes[0].children = [nodes[1], nodes[3]];
    nodes[1].children = [nodes[3]];
    nodes[3].children = [nodes[4]];
    nodes[4].children = [nodes[1],nodes[2]];

    var testPlans = buildTestPlans([nodes[0]]);

    expect(testPlans[0]).to.deep.equal([
      nodes[0],
      nodes[1],
      nodes[3],
      nodes[4],
      nodes[2]
    ]);

    expect(testPlans[1]).to.deep.equal([
      nodes[0],
      nodes[3],
      nodes[4],
      nodes[1]
    ]);

    expect(testPlans[2]).to.deep.equal([
      nodes[0],
      nodes[3],
      nodes[4],
      nodes[2]
    ]);
  });

  it("should build for graph that cycles to root", function() {
    var nodes = createNodes(2);
    nodes[0].children = [nodes[1]];
    nodes[1].children = [nodes[0]];

    var testPlans = buildTestPlans([nodes[0]]);

    expect(testPlans[0]).to.deep.equal([
      nodes[0],
      nodes[1]
    ]);
  });

  it("should build for graph with multiple roots", function() {
    var nodes = createNodes(2);

    var testPlans = buildTestPlans(nodes);

    expect(testPlans[0]).to.deep.equal([
      nodes[0]
    ]);

    expect(testPlans[1]).to.deep.equal([
      nodes[1]
    ]);
  });
});

