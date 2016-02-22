var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var expect = require('chai').expect;
var dsl = require('../../lib/property_constraints');


var nullState = dsl(function() {
  return this.constraint(Object.keys, this.get('length'), this.eq(0));;
});


var hasType = function(type) {
  return dsl(function() {
    return this.constraint(this.get('todos'), this.withSome([type]));
  });
};


var hasFilter = function(type) {
  return dsl(function() {
    return this.constraint(this.get('filter'), this.eq(type));
  });
};


var hasTodos = dsl(function() {
  return this.constraint(this.get('todos'), this.not(this.isEmpty));
});


var active = dsl(function() {
  return this.constraint(this.get('state'), this.eq('active'));
});
var hasCompletedTodos = hasType('completed');
var hasActiveTodos = hasType('active');

var hasActiveFilter = hasFilter('active');
var hasCompletedFilter = hasFilter('completed');
var hasAllFilter = hasFilter('all');

var conditions = {
  empty: function(selector) {
    return new webdriver.until.Condition('for ' + selector + ' to be empty', function(driver) {
      return driver.findElements(selector).then(function(elems) {
        return elems.length === 0;
      });
    });
  }
};

module.exports.transitions = [
  {
    name: 'select all filter',
    requires: dsl(function() {
      return this.not(hasAllFilter);
    }),
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
    requires: dsl(function() {
      return this.not(hasActiveFilter);
    }),
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
    requires: dsl(function() {
      return this.not(hasCompletedFilter);
    }),
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
    requires: nullState,
    provides: function(state) {
      state.filter = 'all';
      state.todos = [];
      return state;
    },
    apply: function() {}
  },
  {
    name: 'add todo',
    requires: dsl(function() {
      return this.and(
        this.constraint(this.get('todos'),
          this.get('length'),
          this.lt(2)),
        this.constraint(this.getIn(['todos', '0', 'title']),
          this.not(this.eq('1'))));
    }),
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
    requires: dsl(function() {
      return this.and(
        hasActiveTodos,
        this.not(hasCompletedFilter)
      );
    }),
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
    requires: dsl(function() {
      return this.and(
        hasTodos,
        hasAllFilter
      );
    }),
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
    requires: dsl(function() {
      return this.and(
        hasCompletedTodos,
        hasAllFilter
      );
    }),
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
    driver.wait(conditions.empty(By.css(selector)));
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

module.exports.verifications = dsl(function() {
  return [
    {
      name: 'verify all todos',
      requires: this.and(hasTodos, hasAllFilter),
      apply: function(driver, state) {
        verifyTodos(driver, state.todos);
      }
    },
    {
      name: 'verify active todos',
      requires: this.and(hasTodos, hasActiveFilter),
      apply: function(driver, state) {
        verifyTodos(driver, active(state.todos));
      }
    },
    {
      name: 'verify completed todos',
      requires: this.and(hasTodos, hasCompletedFilter),
      apply: function(driver, state) {
        verifyTodos(driver, completed(state.todos));
      }
    },
    {
      name: 'verify todos remaining',
      requires: this.constraint(this.get('todos'), active, this.getSize, this.eq(1)),
      apply: function(driver, state) {
        driver.findElement(By.css('.todo-count')).getText().then(function(text) {
          expect(text).to.equal('1 item left');
        });
      }
    },
    {
      name: 'verify multiple todos remaining',
      requires: this.and(hasTodos, this.constraint(this.get('todos'), active, this.get('length'), this.gt(1))),
      apply: function(driver, state) {
        driver.findElement(By.css('.todo-count')).getText().then(function(text) {
          expect(text).to.equal(state.todos.length + ' items left');
        });
      }
    },
    {
      name: 'verify todos remaining when none active',
      requires: this.and(hasTodos, this.constraint(this.get('todos'), active, this.isEmpty)),
      apply: function(driver, state) {
        driver.findElement(By.css('.todo-count')).getText().then(function(text) {
          expect(text).to.equal('0 items left');
        });
      }
    }
  ];
});
