module.exports = function traverse(node, visitNode) {

  if(node.length === 0) return;
  var root = node[0];
  var queue = [root];
  var handled = {};
  handled[root.name] = true;
  while (queue.length > 0) {
    var thisNode = queue.shift();
    visitNode(thisNode);
    if(thisNode.children) {
      thisNode.children.forEach(function(child) {
        if(!handled.hasOwnProperty(child.name)) {
          handled[child.name] = true;
          queue.push(child);
        }
      });
    }
  }
};