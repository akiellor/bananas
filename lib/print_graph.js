module.exports = function printGraph(graph) {
  graph.forEach(function(value, key) {
    console.log(key);
    value.forEach(function(value) {
      console.log('\t' + value);
    });
  });
};
