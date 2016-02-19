var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var expect = require('chai').expect;

function hasSufficientTodosForFilters(state) {
  return state.todos && state.todos.length > 1;
}

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
    requires: function(state) {
      return hasSufficientTodosForFilters(state) && state.filter !== 'all';
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
    requires: function(state) {
      return hasSufficientTodosForFilters(state) && state.filter !== 'active';
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
    requires: function(state) {
      return hasSufficientTodosForFilters(state) && state.filter !== 'completed';
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
    requires: function(state) {
      return !state.todos;
    },
    provides: function(state) {
      state.filter = 'all';
      state.todos = [];
      return state;
    },
    apply: function() {}
  },
  {
    name: 'add todo',
    requires: function(state) {
      if (state.todos && state.todos[0] && state.todos[0].title === '1') {
        return false;
      }
      return state.todos && state.todos.length < 2;
    },
    provides: function(state) {
      state.todos.push({
        title: '' + state.todos.length,
        state: 'active'
      });
      return state;
    },
    apply: function(driver, state) {
      var todo = state.todos[state.todos.length - 1];
      driver
        .wait(until.elementLocated(By.css(".new-todo")));
      driver
        .findElement(By.css(".new-todo"))
        .sendKeys(todo.title + "\n");
    }
  },
  {
    name: 'complete todo',
    requires: function(state) {
      return state.todos && state.todos[0] && state.todos[0].state === "active" && (state.filter === 'all' || state.filter === 'active');
    },
    provides: function(state) {
      var todo = state.todos[0];
      todo.state = 'completed';
      return state;
    },
    apply: function(driver) {
      driver
        .findElement(By.css(".todo-list li .toggle")).click();
    }
  },
  {
    name: 'delete todo from all',
    requires: function(state) {
      return state.todos && state.todos.length > 0 && state.filter === 'all';
    },
    provides: function(state) {
      state.todos = state.todos.slice(1);
      return state;
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
    requires: function(state) {
      return state.todos && completed(state.todos).length > 0 && state.filter === 'all';
    },
    provides: function(state) {
      state.todos = active(state.todos);
      return state;
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

function verifyTodos(driver, expected) {
  var selector = ".todo-list li";
  if (expected.length === 0) {
    driver.findElements(By.css(selector)).then(function(elems) {
      expect(elems).to.be.empty;
    });
  } else {
    driver.wait(until.elementsLocated(By.css(selector)));
    getTexts(driver, selector).then(function(actual) {
      expect(actual.length).to.equal(expected.length);
      expected.forEach(function(todo) {
        expect(actual).to.contain(todo.title);
      });
    });
  }
}

module.exports.verifications = [
  {
    name: 'verify all todos',
    requires: function(state) {
      return state.todos && state.filter === 'all';
    },
    apply: function(driver, state) {
      verifyTodos(driver, state.todos);
    }
  },
  {
    name: 'verify active todos',
    requires: function(state) {
      return state.todos && state.filter === 'active';
    },
    apply: function(driver, state) {
      verifyTodos(driver, active(state.todos));
    }
  },
  {
    name: 'verify completed todos',
    requires: function(state) {
      return state.todos && state.filter === 'completed';
    },
    apply: function(driver, state) {
      verifyTodos(driver, completed(state.todos));
    }
  },
  {
    name: 'verify todos remaining',
    requires: function(state) {
      return active(state.todos).length === 1;
    },
    apply: function(driver, state) {
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
        expect(text).to.equal('1 item left');
      });
    }
  },
  {
    name: 'verify multiple todos remaining',
    requires: function(state) {
      return active(state.todos).length > 1;
    },
    apply: function(driver, state) {
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
        expect(text).to.equal(state.todos.length + ' items left');
      });
    }
  },
  {
    name: 'verify todos remaining when none active',
    requires: function(state) {
      return state.todos && state.todos.length > 0 && active(state.todos).length === 0;
    },
    apply: function(driver, state) {
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
        expect(text).to.equal('0 items left');
      });
    }
  }
];
