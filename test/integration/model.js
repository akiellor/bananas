module.exports.active = function active(todos) {
  return todos.filter(function(todo) { return todo.state === 'active'; });
}

module.exports.completed = function completed(todos) {
  return todos.filter(function(todo) { return todo.state === 'completed'; });
}


