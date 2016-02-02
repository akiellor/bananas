var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var model = require(__dirname + '/model');
var completed = model.completed;
var active = model.active;

function wait(driver) {
  var foo = false;
  setTimeout(function() {
    foo = true;
  }, 10000);
  driver.wait(new webdriver.until.Condition('', function() {
    return foo;
  }));
}

module.exports = [
  {
    name: 'select all filter',
    requires: function(model) {
      return model.todos && model.todos.length > 0 && model.filter !== 'all';
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
      return model.todos && model.todos.length > 0 && model.filter !== 'active';
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
      return model.todos && model.todos.length > 0 && model.filter !== 'completed';
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
        .findElement(By.css("#todo-list li .toggle")).click();
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
        .findElement(By.css("#todo-list li"))
        .then(function(elem) {
          driver.actions().mouseMove(elem).perform();
          elem.findElement(By.css('.destroy')).click();
        });
    }
  },
  {
    name: 'clear completed',
    requires: function(model) {
      return model.todos && completed(model.todos).length > 0;
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
