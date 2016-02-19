var propertyConstraints = require(__dirname + '/../lib/property_constraints');
var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

describe('Property Constraints', function() {
  var expectations = [
    {
      constraints: [
        {
          hasProperty: 'mandatoryProperty'
        }
      ],
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
      constraints: [
        {
          hasNoProperty: 'prop'
        }
      ],
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
      constraints: [{
        hasProperty: 'mandatoryProperty'
      }, {
        hasProperty: 'otherProperty'
      }],
      states: [
        {state: {}, result: false},
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
      constraints: [{
        hasProperty: 'mandatoryProperty',
        withValue: 'strike'
      }],
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
      constraints: [{
        hasProperty: 'mandatoryProperty',
        withCardinality: '=3'
      }],
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
      constraints: [{
        hasProperty: 'mandatoryProperty',
        withCardinality: '<3'
      }],
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
      constraints: [{
        hasProperty: 'mandatoryProperty',
        withSome: ['complete']
      }],
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
      constraints: [{
        hasProperty: 'mandatoryProperty',
        withSome: function(value) {
          return value.get('status') === 'active';
        }
      }],
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
      constraints: [{
        hasProperty: 'mandatoryProperty',
        withAll: ['complete', 'done']
      }],
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
    },
    {
      constraints: [{
        hasProperty: 'mandatoryProperty',
        withValueFrom: ['complete', 'active']
      }],
      states: [
        {
          state: {
            'mandatoryProperty': ['complete', 'active']
          },
          result: true
        },
        {
          state: {
            'mandatoryProperty': ['complete', 'active', 'extra']
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
          var predicate = propertyConstraints(Immutable.fromJS(expectation.constraints));

          expect(predicate(Immutable.fromJS(state.state))).to.equal(state.result);
        });
      });
    });
  });
});
