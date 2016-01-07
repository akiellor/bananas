var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var scenarioBuilder = require(__dirname + '/../../lib/scenario_builder');
var expect = require('chai').expect;

function getTexts(driver, selector) {
  return driver
  .findElements(By.css(selector))
  .then(function(elems) {
    return webdriver.promise.all(elems.map(function(elem) {
      return elem.getText();
    }));
  });
}

var transitions = [
  {
    name: 'add todo 1',
    requires: function(model) {
      return !(model.todos && model.todos.first);
    },
    provides: {todos: {first: {title: "first"}}},
    apply: function(driver) {
      driver
        .wait(until.elementLocated(By.css("#new-todo")));
      driver
        .findElement(By.css("#new-todo"))
        .sendKeys("first\n");
    }
  },
  {
    name: 'complete todo 1',
    requires: function(model) {
      return model.todos && model.todos.first;
    },
    provides: {todos: {first: undefined}, completedTodos: {first: true}},
    apply: function(driver) {
      driver
        .findElement(By.css("#todo-list li .toggle")).click();
    }
  },
  {
    name: 'delete todo 1',
    requires: function(model) {
      return model.todos && model.todos.first;
    },
    provides: {todos: {first: undefined}, deletedTodos: {first: true}},
    apply: function(driver) {
      driver
        .findElement(By.css("#todo-list li"))
        .then(function(elem) {
          driver.actions().mouseMove(elem).perform();
        });
      driver
        .findElement(By.css("#todo-list li .destroy"))
        .click();
    }
  },
  {
    name: 'clear completed',
    requires: function(model) {
      return model.completedTodos && model.completedTodos.first;
    },
    provides: {completedTodos: {first: undefined}, clearedTodos: {first: true}},
    apply: function(driver) {
      driver
        .findElement(By.css("#clear-completed"))
        .click();
    }
  }
];

var verifications = [
  {
    name: 'verify first',
    requires: function(model) {
      return model.todos.first !== undefined;
    },
    apply: function(driver, model) {
      getTexts(driver, "#todo-list li").then(function(texts) {
        expect(texts).to.contain(model.todos.first.title);
      });
    }
  },
  {
    name: 'verify first deleted',
    requires: function(model) {
      return model.deletedTodos && model.deletedTodos.first !== undefined;
    },
    apply: function(driver, model) {
      getTexts(driver, "#todo-list li").then(function(texts) {
        expect(texts).to.not.contain('first');
      });
    }
  },
  {
    name: 'verify first completed',
    requires: function(model) {
      return model.completedTodos && model.completedTodos.first;
    },
    apply: function(driver, model) {
      getTexts(driver, "#todo-list li.completed").then(function(texts) {
        expect(texts).to.contain('first');
      });
    }
  },
  {
    name: 'verify first cleared',
    requires: function(model) {
      return model.clearedTodos && model.clearedTodos.first;
    },
    apply: function(driver, model) {
      getTexts(driver, "#todo-list li").then(function(texts) {
        expect(texts).to.not.contain('first');
      });
    }
  }
];

var options = {
  host: 'localhost',
  port: '9515',
  desiredCapabilities: {
    browserName: 'chrome'
  }
};

describe('todomvc', function() {
  this.timeout(100000);

  var builder = scenarioBuilder(transitions, verifications);
  builder.build(function(testPlan) {
    it(testPlan.name, function(done) {
      var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
      driver.get('http://todomvc.com/examples/angularjs/#/');

      testPlan.apply(driver);

      driver.quit().then(done);
    });
  });
});
