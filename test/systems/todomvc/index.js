var webdriver = require('selenium-webdriver');

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

module.exports = function todomvc(cb) {
  var serve = serveStatic('test/systems/todomvc/app');

  var server = http.createServer(function(req, res){
    var done = finalhandler(req, res);
    serve(req, res, done);
  });

  server.listen(8000);

  var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
  return driver;
}
