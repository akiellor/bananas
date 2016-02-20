var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var expect = require('chai').expect;

function hasProperty(name) {
  return function(state) {
    return state.hasOwnProperty(name);
  }
}

function not(fn) {
  return function(state) {
    return !fn(state);
  }
}

function and() {
  var fns = Array.prototype.slice.call(arguments);
  return function(state) {
    return fns.reduce(function(memo, fn) {
      return memo && fn(state);
    }, true);
  }
}

function reduce(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return function(state) {
      return args.reduce(fn, state);
    }
  }
}

var sequence = reduce(function(memo, fn) {
  return fn(memo);
});

var get = reduce(function(memo, attr) {
  return memo && memo[attr];
});

var size = get('length');

var nullState = sequence(Object.keys, size, eq(0));

var empty = sequence(size, eq(0));

var hasSize = function(pred) {
  return sequence(size, pred);
}

function eq(value) {
  return function(other) {
    return other === value;
  }
}

function gt(value) {
  return function(other) {
    return other > value;
  }
}

function lt(value) {
  return function(other) {
    return other < value;
  }
}

function filterWith(pred) {
  return function(list) {
    return list.filter(pred);
  };
}

var hasSufficientTodosForFilters = sequence(get('todos'), size, gt(1));

var active = filterWith(sequence(get('state'), eq('active')));
var completed = filterWith(sequence(get('state'), eq('completed')));
var hasTodos = and(hasProperty('todos'), sequence(get('todos'), not(empty)));
var hasCompletedTodos = and(hasTodos, sequence(get('todos'), completed, not(empty)));
var firstTodoActive = and(hasTodos, sequence(get('todos', 0, 'state'), eq('active')));

function hasTodoFilter(pred) {
  return sequence(get('filter'), pred);
}
var hasActiveFilter = hasTodoFilter(eq('active'));
var hasCompletedFilter = hasTodoFilter(eq('completed'));
var hasAllFilter = hasTodoFilter(eq('all'));

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
    requires: and(hasSufficientTodosForFilters, not(hasAllFilter)),
    provides: {filter: 'all'},
    apply: function(driver) {
      driver
        .findElement(By.linkText('All'))
        .click();
    }
  },
  {
    name: 'select active filter',
    requires: and(hasSufficientTodosForFilters, not(hasActiveFilter)),
    provides: {filter: 'active'},
    apply: function(driver) {
      driver
        .findElement(By.linkText('Active'))
        .click();
    }
  },
  {
    name: 'select completed filter',
    requires: and(hasSufficientTodosForFilters, not(hasCompletedFilter)),
    provides: {filter: 'completed'},
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
    requires: and(
      hasProperty('todos'),
      sequence(get('todos'), size, lt(2)),
      sequence(get('todos', 0, 'title'), not(eq('1')))
    ),
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
    requires: and(firstTodoActive, not(hasCompletedFilter)),
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
    requires: and(hasTodos, hasAllFilter),
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
    requires: and(hasCompletedTodos, hasAllFilter),
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
    requires: and(hasTodos, hasAllFilter),
    apply: function(driver, state) {
      verifyTodos(driver, state.todos);
    }
  },
  {
    name: 'verify active todos',
    requires: and(hasTodos, hasActiveFilter),
    apply: function(driver, state) {
      verifyTodos(driver, active(state.todos));
    }
  },
  {
    name: 'verify completed todos',
    requires: and(hasTodos, hasCompletedFilter),
    apply: function(driver, state) {
      verifyTodos(driver, completed(state.todos));
    }
  },
  {
    name: 'verify todos remaining',
    requires: sequence(get('todos'), active, hasSize(eq(1))),
    apply: function(driver, state) {
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
        expect(text).to.equal('1 item left');
      });
    }
  },
  {
    name: 'verify multiple todos remaining',
    requires: and(hasTodos, sequence(get('todos'), active, size, gt(1))),
    apply: function(driver, state) {
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
        expect(text).to.equal(state.todos.length + ' items left');
      });
    }
  },
  {
    name: 'verify todos remaining when none active',
    requires: and(hasTodos, sequence(get('todos'), active, empty)),
    apply: function(driver, state) {
      driver.findElement(By.css('.todo-count')).getText().then(function(text) {
        expect(text).to.equal('0 items left');
      });
    }
  }
];
