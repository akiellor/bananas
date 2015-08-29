module.exports = function traverse(node, visitNode, visited) {

  if(!(node && node.children && node.children.length === 0)) return;
  visited = visited || {};

  visitNode(node);
  node.children.forEach(
    function(child) {
      if(!visited[child.name]) {
        visited[child.name] = true;
        traverse(child);
        visited[child.name] = false;
      }
    }
  );
};