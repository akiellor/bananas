var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;
var I = Immutable.fromJS;
var splice = require('../lib/splice');

describe('splice', function() {
  it('should interleave at the appropriate locations', function() {
    var list1 = I([
      {
        name: 'first',
        provides: {first: 1}
      },
      {
        name: 'third',
        provides: function(state) {
          state.third = 1;
          return state;
        }
      }
    ]);
    var list2 = I([
      {
        name: 'second',
        requires: function(state) {
          return state.first && !state.third;
        }
      },
      {
        name: 'fourth',
        requires: {third: 1}
      }
    ]);

    var result = splice(list2, list1).map(function(item) {
      return item.get('name');
    });

    expect(result).to.equal(I([
      "first",
      "group('second')",
      "third",
      "group('fourth')"
    ]));
  });
});
