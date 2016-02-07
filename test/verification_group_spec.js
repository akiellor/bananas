var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;
var I = Immutable.fromJS;
var createVerificationGroup = require('../lib/verification_group');

describe('verification group', function() {
  var verifications = I([
    {
      name: 'never gonna work',
      apply: function(system) {
        expect(false).to.equal(true);
      }
    },
    {
      name: 'really never gonna work',
      apply: function(system) {
        expect(false).to.equal(true);
      }
    },
 
    {
      name: 'ok',
      apply: function(system) {
        expect(true).to.equal(true);
      }
    }
  ]);


  it('should collect errors from all verifications', function() {
    var group = createVerificationGroup(verifications);

    expect(group.get('name')).to.equal('group(\'never gonna work\', \'really never gonna work\', \'ok\')');
    expect(function() { group.get('apply')(undefined) })
      .to.throw(Error)
      .and.to.satisfy(function(error) {
        expect(error.message).to.equal('never gonna work: expected false to equal true\nreally never gonna work: expected false to equal true');
        expect(error.errors.length).to.equal(2);
        var first = error.errors[0];
        expect(first.error.message).to.equal("expected false to equal true");
        expect(first.verification.name).to.equal("never gonna work");
        return true;
      });
  });

  it('should not throw if no errors', function() {
    var group = createVerificationGroup(I([verifications.get(2)]));

    expect(function() { group.get('apply')(undefined) })
      .to.not.throw(Error);
  });

  it('should throw original error if only one occurs', function() {
    var group = createVerificationGroup(I([verifications.get(0)]));

    expect(function() { group.get('apply')(undefined) })
      .to.throw('AssertionError');
  });
});
