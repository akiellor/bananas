var propertyConstraints = require(__dirname + '/../lib/property_constraints');
var chai = require('chai');
var expect = chai.expect;


var bindDsl = function(fn) {
  return propertyConstraints(fn);
};

describe('Property Constraints', function() {

  var expectations = [
    {
      constraints: bindDsl(function() {
        return this.constraint(this.hasProperty('mandatoryProperty'));
      }),
      states: [
        {
          state: {
            mandatoryProperty: 'someVal',
            collateralProperty: ''
          },
          result: true
        },
        {
          state: {},
          result: false
        },
        {
          state: {
            mandatoryProperty: null
          },
          result: false
        }
      ]
    },
    {
      constraints: bindDsl(function() {
        return this.constraint(this.not(this.hasProperty('prop')));
      }),
      states: [
        {
          state: {
            prop: 'value'
          },
          result: false
        }
      ]
    },
    {
      constraints: bindDsl(function() {
        return this.and(this.constraint(this.hasProperty('mandatoryProperty')),
          this.constraint(this.hasProperty('otherProperty')));
      }),
      states: [
        {
          state: {},
          result: false
        },
        {
          state: {
            'mandatoryProperty': 'someVal',
            'otherProperty': 'otherVal'
          },
          result: true
        },
        {
          state: {
            'mandatoryProperty': 'someVal'
          },
          result: false
        }
      ]
    },
    {
      constraints: bindDsl(function() {
        return this.constraint(this.get('mandatoryProperty'),
          this.eq('strike'));
      }),
      states: [
        {
          state: {
            'mandatoryProperty': 'strike'
          },
          result: true
        }
      ]
    },
    {
      constraints: bindDsl(function() {
        return this.constraint(this.get('mandatoryProperty'), this.get('length'), this.eq(3));
      }),
      states: [
        {
          state: {
            'mandatoryProperty': [1, 2, 3]
          },
          result: true
        },
        {
          state: {},
          result: false
        }
      ]
    },
    {
      constraints: bindDsl(function() {
        return this.constraint(this.get('mandatoryProperty'), this.get('length'), this.gt(3));
      }),
      states: [
        {
          state: {
            'mandatoryProperty': [1, 2, 3]
          },
          result: false
        }
      ]
    },
    {
      constraints: bindDsl(function() {
        return this.constraint(this.get('mandatoryProperty'), this.withSome(['vanity']));
      }),
      states: [
        {
          state: {
            'mandatoryProperty': ['complete', 'done', 'vanity']
          },
          result: true
        },
        {
          state: {
            'mandatoryProperty': 'foo'
          },
          result: false
        }
      ]
    },
    {
      constraints: bindDsl(function() {
        return this.constraint(this.get('mandatoryProperty'), this.filterWith(function(value) {
          return value['status'] === 'active';
        }));
      }),
      states: [
        {
          state: {
            'mandatoryProperty': [{
              status: 'active'
            }]
          },
          result: true
        }
      ]
    },
    {
      constraints: bindDsl(function() {
        return this.constraint(this.get('mandatoryProperty'), this.withAll(['complete', 'vanity', 'done']));
      }),
      states: [
        {
          state: {
            'mandatoryProperty': ['complete', 'done', 'vanity']
          },
          result: true
        },
        {
          state: {
            'mandatoryProperty': ['complete', 'vanity']
          },
          result: false
        }
      ]
    }
  ];



  expectations.forEach(function(expectation) {
    describe(JSON.stringify(expectation.constraints), function() {
      expectation.states.forEach(function(state) {
        it('should be ' + state.result + ' for ' + JSON.stringify(state.state), function() {
          var predicate = expectation.constraints;

          expect(predicate(state.state)).to.equal(state.result);
        });
      });
    });
  });
});
