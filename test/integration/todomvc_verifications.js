var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var expect = require('chai').expect;
var transitions = require(__dirname + '/todomvc_transitions');
var model = require(__dirname + '/model');
var completed = model.completed;
var active = model.active;

function getTexts(driver, selector) {
  return driver
  .findElements(By.css(selector))
  .then(function(elems) {
    return webdriver.promise.all(elems.map(function(elem) {
      return elem.getText();
    }));
  });
}

module.exports = [
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


