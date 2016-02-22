var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var expect = require('chai').expect;

module.exports.transitions = [
  {
    name: 'visit landing page',
    requires: and(hasSufficientTodosForFilters, not(hasAllFilter)),
    provides: {
      filter: 'all'
    },
    apply: function(driver) {
      driver
        .findElement(By.linkText('All'))
        .click();
    }
  }
];

module.exports.verifications = [];
