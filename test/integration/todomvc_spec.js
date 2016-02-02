var webdriver = require('selenium-webdriver');
var createTestPlan = require(__dirname + '/../../lib/test_plan');
var transitions = require(__dirname + '/todomvc_transitions');
var verifications = require(__dirname + '/todomvc_verifications');

var options = {
  host: 'localhost',
  port: '9515',
  desiredCapabilities: {
    browserName: 'chrome'
  }
};

describe('todomvc', function() {
  this.timeout(100000);
  var driver;

  before(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  });

  beforeEach(function() {
    driver.get('http://todomvc.com/examples/angularjs/#/');
  });

  var testPlan = createTestPlan(transitions, verifications);
  testPlan.forEach(function(test) {
    it(test.name, function(done) {
      test.apply(driver);

      driver.getTitle().then(function() {
        done();
      });
    });
  });

  afterEach(function() {
    driver.executeScript('window.localStorage.clear();');
  });

  after(function(done) {
    driver.quit().then(done);
  });
});
