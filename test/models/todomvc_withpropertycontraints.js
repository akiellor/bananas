var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var expect = require('chai').expect;

var hasSomeTodos = function() {
  return {
    hasProperty: 'todos',
    withCardinality: '>0'
  };
};


var hasSomeTodosLessThan = function(num) {
  return {
    hasProperty: 'todos',
    withCardinality: '<' + num
  };
};

var hasNoTodos = function() {
  return {
    hasNoProperty: 'todos'
  };
};

var hasFilterOfNotType = function(filterType) {
  return {
    hasProperty: 'filter',
    withNotValue: filterType
  };
};


var hasFilterOfType = function(filterType) {
  return {
    hasProperty: 'filter',
    withValue: filterType
  };
};


function active(todos) {
  return todos.filter(function(todo) {
    return todo.state === 'active';
  });
}

function completed(todos) {
  return todos.filter(function(todo) {
    return todo.state === 'completed';
  });
}


module.exports.transitions = [
  {
    name: 'select all filter',
    requires: {
      constraint: [hasFilterOfNotType('all'), hasSomeTodos()]
    },
    provides: {
      filter: 'all'
    },
    apply: function(driver) {
      driver
        .findElement(By.linkText('All'))
        .click();
    }
  },
  {
    name: 'select active filter',
    requires: {
      constraint: [hasFilterOfNotType('active'), hasSomeTodos()]
    },
    provides: {
      filter: 'active'
    },
    apply: function(driver) {
      driver
        .findElement(By.linkText('Active'))
        .click();
    }
  },
  {
    name: 'select completed filter',
    requires: {
      constraint: [hasFilterOfNotType('completed'), hasSomeTodos()]
    },
    provides: {
      filter: 'completed'
    },
    apply: function(driver) {
      driver
        .findElement(By.linkText('Completed'))
        .click();
    }
  },
  {
    name: 'init todos',
    requires: {
      constraint: [hasNoTodos()]
    },
    provides: function(model) {
      model.filter = 'all';
      model.todos = [];
      return model;
    },
    apply: function() {}
  },
  {
    name: 'add todo',
    requires: {
      constraint: [hasSomeTodosLessThan(3)]
    },
    provides: function(model) {
      model.todos.push({
        title: '' + model.todos.length,
        state: 'active'
      });
      return model;
    },
    apply: function(driver, model) {
      model.todos.forEach(function(todo) {
        driver
          .wait(until.elementLocated(By.css("#new-todo")));
        driver
          .findElement(By.css("#new-todo"))
          .sendKeys(todo.title + "\n");
      });
    }
  },
  {
    name: 'complete todo',
    requires: {
      constraint: [{
        hasProperty: 'todos',
        withCardinality: '>0',
        withSome: function(value) {
          return value.state === 'active';
        }
      }]
    },
    provides: function(model) {
      var todo = model.todos[0];
      todo.state = 'completed';
      return model;
    },
    apply: function(driver) {
      driver
        .findElement(By.css("#todo-list li .toggle")).click();
    }
  },
  {
    name: 'delete todo from all',
    requires: {
      constraint: [hasSomeTodos(), hasFilterOfType('all')]
    },
    provides: function(model) {
      model.todos = model.todos.slice(1);
      return model;
    },
    apply: function(driver) {
      driver
        .findElement(By.css("#todo-list li"))
        .then(function(elem) {
          driver.actions().mouseMove(elem).perform();
          elem.findElement(By.css('.destroy')).click();
        });
    }
  },
  {
    name: 'clear completed',
    requires: {
      constraint: [{
        hasProperty: 'todos',
        withCardinality: '>0',
        withSome: function(value) {
          return value.state === 'completed';
        }
      },
        hasFilterOfType('all')
      ]
    },
    provides: function(model) {
      model.todos = active(model.todos);
      return model;
    },
    apply: function(driver) {
      driver
        .findElement(By.css("#clear-completed"))
        .click();
    }
  }
];

function getTexts(driver, selector) {
  return driver
    .findElements(By.css(selector))
    .then(function(elems) {
      return webdriver.promise.all(elems.map(function(elem) {
        return elem.getText();
      }));
    });
}

module.exports.verifications = [
  {
    name: 'verify all todos',
    requires: function(model) {
      return model.todos && model.filter === 'all';
    },
    apply: function(driver, model) {
      getTexts(driver, "#todo-list li").then(function(texts) {
        var todos = model.todos;
        expect(texts.length).to.equal(todos.length);
        todos.forEach(function(todo) {
          expect(texts).to.contain(todo.title);
        });
      });
    }
  },
  {
    name: 'verify active todos',
    requires: function(model) {
      return model.todos && model.filter === 'active';
    },
    apply: function(driver, model) {
      getTexts(driver, "#todo-list li").then(function(texts) {
        var todos = active(model.todos);
        expect(texts.length).to.equal(todos.length);
        todos.forEach(function(todo) {
          expect(texts).to.contain(todo.title);
        });
      });
    }
  },
  {
    name: 'verify completed todos',
    requires: function(model) {
      return model.todos && model.filter === 'completed';
    },
    apply: function(driver, model) {
      var todos = completed(model.todos);
      getTexts(driver, "#todo-list li.completed").then(function(texts) {
        expect(texts.length).to.equal(todos.length);
        todos.forEach(function(todo) {
          expect(texts).to.contain(todo.title);
        });
      });
    }
  },
  {
    name: 'verify todos remaining',
    requires: function(model) {
      return active(model.todos).length === 1;
    },
    apply: function(driver, model) {
      driver.findElement(By.css('#todo-count')).getText().then(function(text) {
        expect(text).to.equal('1 item left');
      });
    }
  },
  {
    name: 'verify multiple todos remaining',
    requires: function(model) {
      return active(model.todos).length > 1;
    },
    apply: function(driver, model) {
      driver.findElement(By.css('#todo-count')).getText().then(function(text) {
        expect(text).to.equal(model.todos.length + ' items left');
      });
    }
  },
  {
    name: 'verify todos remaining when none active',
    requires: function(model) {
      return model.todos && model.todos.length > 0 && active(model.todos).length === 0;
    },
    apply: function(driver, model) {
      driver.findElement(By.css('#todo-count')).getText().then(function(text) {
        expect(text).to.equal('0 items left');
      });
    }
  }
];
