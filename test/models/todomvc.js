var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var expect = require('chai').expect;

function hasSufficientTodosForFilters(model) {
  return model.todos && model.todos.length > 1;
}

function active(todos) {
  return todos.filter(function(todo) { return todo.state === 'active'; });
}

function completed(todos) {
  return todos.filter(function(todo) { return todo.state === 'completed'; });
}

function wait(driver) {
  var foo = false;
  setTimeout(function() {
    foo = true;
  }, 10000000);
  driver.wait(new webdriver.until.Condition('', function() {
    return foo;
  }));
}

module.exports.transitions = [
  {
    name: 'select all filter',
    requires: function(model) {
      return hasSufficientTodosForFilters(model) && model.filter !== 'all';
    },
    provides: {filter: 'all'},
    apply: function(driver) {
      driver
        .findElement(By.linkText('All'))
        .click();
    }
  },
  {
    name: 'select active filter',
    requires: function(model) {
      return hasSufficientTodosForFilters(model) && model.filter !== 'active';
    },
    provides: {filter: 'active'},
    apply: function(driver) {
      driver
        .findElement(By.linkText('Active'))
        .click();
    }
  },
  {
    name: 'select completed filter',
    requires: function(model) {
      return hasSufficientTodosForFilters(model) && model.filter !== 'completed';
    },
    provides: {filter: 'completed'},
    apply: function(driver) {
      driver
        .findElement(By.linkText('Completed'))
        .click();
    }
  },
  {
    name: 'init todos',
    requires: function(model) {
      return !model.todos;
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
    requires: function(model) {
      if (model.todos && model.todos[0] && model.todos[0].title === '1') {
        return false;
      }
      return model.todos && model.todos.length < 2;
    },
    provides: function(model) {
      model.todos.push({title: '' + model.todos.length, state: 'active'});
      return model;
    },
    apply: function(driver, model) {
      var todo = model.todos[model.todos.length - 1];
      driver
        .wait(until.elementLocated(By.css(".new-todo")));
      driver
        .findElement(By.css(".new-todo"))
        .sendKeys(todo.title + "\n");
    }
  },
  {
    name: 'complete todo',
    requires: function(model) {
      return model.todos && model.todos[0] && model.todos[0].state === "active" && (model.filter === 'all' || model.filter === 'active');
    },
    provides: function(model) {
      var todo = model.todos[0];
      todo.state = 'completed';
      return model;
    },
    apply: function(driver) {
      driver
        .findElement(By.css(".todo-list li .toggle")).click();
    }
  },
  {
    name: 'delete todo from all',
    requires: function(model) {
      return model.todos && model.todos.length > 0 && model.filter === 'all';
    },
    provides: function(model) {
      model.todos = model.todos.slice(1);
      return model;
    },
    apply: function(driver) {
      driver
        .findElement(By.css(".todo-list li"))
        .then(function(elem) {
          driver.actions().mouseMove(elem).perform();
          elem.findElement(By.css('.destroy')).click();
        });
    }
  },
  {
    name: 'clear completed',
    requires: function(model) {
      return model.todos && completed(model.todos).length > 0 && model.filter === 'all';
    },
    provides: function(model) {
      model.todos = active(model.todos);
      return model;
    },
    apply: function(driver) {
      driver
        .findElement(By.css(".clear-completed"))
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
      getTexts(driver, ".todo-list li").then(function(texts) {
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
      getTexts(driver, ".todo-list li").then(function(texts) {
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
      getTexts(driver, ".todo-list li.completed").then(function(texts) {
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
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
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
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
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
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
        expect(text).to.equal('0 items left');
      });
    }
  }
];


