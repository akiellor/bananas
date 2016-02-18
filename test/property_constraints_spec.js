var propertyConstraints = require(__dirname + '/../lib/property_constraints');
var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

describe('Property Constraints', function() {


  it('Should verify hasProperty restrictions', function() {

    var candidateState = Immutable.Map({
      'mandatoryProperty': 'someVal',
      collateralProperty: ''
    });
    var constraint = [{
      hasProperty: 'mandatoryProperty'
    }];
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(true);

  });


  it('Should verify hasNoProperty restrictions', function() {

    var candidateState = Immutable.Map({
      prop: 'value'
    });
    var constraint = [{
      hasNoProperty: 'prop'
    }];
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);

  });

  it('Should fail hasProperty restrictions', function() {

    //When there is no property
    var candidateState = Immutable.Map({
    });
    var constraint = [{
      hasProperty: 'mandatoryProperty'
    }];
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);

  });

  it('Should fail hasProperty restrictions when value is not set', function() {

    //when the property is not set
    var candidateState = Immutable.Map({
      'mandatoryProperty': undefined
    });

    var constraint = [{
      hasProperty: 'mandatoryProperty'
    }];
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);
  });

  it('Should verify multiple hasProperty restrictions', function() {

    //When there is no property
    var candidateState = Immutable.Map({
    });
    var constraint = [{
      hasProperty: 'mandatoryProperty'
    }, {
      hasProperty: 'otherProperty'
    }];
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);

    //when the property is not set
    var candidateState = Immutable.Map({
      'mandatoryProperty': 'someVal',
      'otherProperty': 'otherVal'
    });
    match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(true);
  });


  it('Should fail  multiple hasProperty restrictions', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty'
    }, {
      hasProperty: 'otherProperty'
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': 'someVal'
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);
  });


  it('Should verify hasProperty restrictions with Value', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withValue: 'strike'
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': 'strike'
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(true);
  });


  it('Should verify hasProperty restrictions with cardinality', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withCardinality: '=3'
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': [1, 2, 3]
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(true);
  });

  it('Should handle undefined with cardinality', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withCardinality: '=3'
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': undefined
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);
  });



  it('Should verify hasProperty restrictions with withSome', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withSome: ['complete']
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': ['complete', 'done', 'vanity']
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(true);
  });

  it('Should verify hasProperty restrictions with withSome function', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withSome: function(value) {
        return value.status === 'active';
      }
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': [{
        status: 'active'
      }]
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(true);
  });


  it('Should fail hasProperty restrictions with withSome', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withSome: ['incomplete']
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': ['complete', 'done', 'vanity']
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);
  });


  it('Should verify hasProperty restrictions with withAll', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withAll: ['complete', 'done']
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': ['complete', 'done', 'vanity']
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(true);
  });

  it('Should fail hasProperty restrictions with withAll', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withAll: ['complete', 'active']
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': ['complete', 'done', 'vanity']
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);
  });


  it('Should verify hasProperty restrictions with withValueFrom', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withValueFrom: ['complete', 'active']
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': ['complete', 'active']
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(true);
  });



  it('Should fail hasProperty restrictions with withValueFrom', function() {

    var constraint = [{
      hasProperty: 'mandatoryProperty',
      withValueFrom: ['complete', 'active']
    }];

    var candidateState = Immutable.Map({
      'mandatoryProperty': ['complete', 'active', 'extra']
    });
    var match = propertyConstraints(Immutable.fromJS(constraint), candidateState);
    expect(match).to.equal(false);
  });

});

