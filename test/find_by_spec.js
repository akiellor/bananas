var Immutable = require('immutable');
var chai = require('chai');
var expect = chai.expect;
var findBy = require('../lib/find_by');
var transitions = require('./models/todomvc_withpropertycontraints').transitions;
describe('find by', function() {
  describe('constraints', function() {

    it('Should find by constraint for root transitions', function() {

      var rootTransitions = findBy(Immutable.Map(), Immutable.fromJS(transitions));
      expect(rootTransitions.size).to.equal(1);
      expect(rootTransitions.getIn([0, 'name'])).to.equal('init todos');
    });


    it('Should find by constraint for filter conditions', function() {

      var rootTransitions = findBy(Immutable.fromJS({
        todos: [1, 2]
      }), Immutable.fromJS(transitions));
      expect(rootTransitions.size).to.equal(1);
      expect(rootTransitions.getIn([0, 'name'])).to.equal('add todo');
    });

  });
});
