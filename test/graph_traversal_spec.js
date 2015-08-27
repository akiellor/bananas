var chai = require('chai'),
  spies = require('chai-spies');

chai.use(spies);
var graphTraversal = require(__dirname + '/../lib/graph_traversal');
var expect = chai.expect;

describe('system', function() {

  it("Should Traverse an Empty Graph", function() {
    var nodeVisitor = chai.spy();
    graphTraversal([], nodeVisitor);

    expect(nodeVisitor).to.not.have.been;
  });


  it("Should Traverse A simple non-cyclical graph", function() {

    var nodeVisitor = chai.spy(console.log);

    function createNode(i) {
      return {name: String(i)};
    }
    var i =0;
    var nodes = Array(6).join().split('').map(function(){return createNode(i++);});
    nodes[0].children = [nodes[1], nodes[3]];
    nodes[1].children = [nodes[3]];
    nodes[3].children = [nodes[4]];
    nodes[4].children = [nodes[1],nodes[2]];

    graphTraversal(nodes, nodeVisitor);
    expect(nodeVisitor).to.have.been.called(5);
    //Check for bfs traversal
    console.log(expect(nodeVisitor.__spy.calls[0][0].name).to.equal(nodes[0].name));
    console.log(expect(nodeVisitor.__spy.calls[1][0].name).to.equal(nodes[1].name));
    console.log(expect(nodeVisitor.__spy.calls[2][0].name).to.equal(nodes[3].name));
    console.log(expect(nodeVisitor.__spy.calls[3][0].name).to.equal(nodes[4].name));
    console.log(expect(nodeVisitor.__spy.calls[4][0].name).to.equal(nodes[2].name));

  });


});

