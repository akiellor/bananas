var expect = require('chai').expect;
var buildTestPlans = require(__dirname + '/../lib/build_test_plans');

describe('build test plans', function() {
  it("should build no plans", function() {
    var testPlans = buildTestPlans([]);

    expect(testPlans).to.deep.equal([]);
  });

  it("should build for non-cyclical graph", function() {
    function createNode(i) {
      return {name: String(i)};
    }
    var i = 0;
    var nodes = Array(6).join().split('').map(function(){return createNode(i++);});
    nodes[0].children = [nodes[1], nodes[3]];
    nodes[1].children = [nodes[3]];
    nodes[3].children = [nodes[4]];
    nodes[4].children = [nodes[1],nodes[2]];

    var testPlans = buildTestPlans(nodes);

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
    function createNode(i) {
      return {name: String(i)};
    }
    var i = 0;
    var nodes = Array(4).join().split('').map(function(){return createNode(i++);});
    nodes[0].children = [nodes[1]];
    nodes[1].children = [nodes[0]];

    var testPlans = buildTestPlans(nodes);

    expect(testPlans[0]).to.deep.equal([
      nodes[0],
      nodes[1]
    ]);
  });
});

