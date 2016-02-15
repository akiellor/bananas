var webdriver = require('selenium-webdriver');
var spawn = require('child_process').spawn;

module.exports = function todomvc(cb) {
  var process = spawn('python', ['-m', 'SimpleHTTPServer', '8000'], {cwd: 'test/systems/todomvc/app', stdio: 'inherit'});

  var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
  return driver;
}
