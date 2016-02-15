var createTestPlan = require(__dirname + '/../lib/test_plan');
var transitions = require(__dirname + '/models/todomvc').transitions;
var verifications = require(__dirname + '/models/todomvc').verifications;
var todomvc = require(__dirname + '/systems/todomvc');

describe('todomvc', function() {
  this.timeout(100000);
  var driver;

  before(function() {
    driver = todomvc();
  });

  beforeEach(function() {
    driver.get('http://localhost:8000');
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
