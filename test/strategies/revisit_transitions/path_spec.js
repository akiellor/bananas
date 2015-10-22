var Immutable = require('immutable');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = chai.expect;

var createPath = require(__dirname + '/../../../lib/strategies/revisit_transitions/path');

describe('path', function() {
  it('should merge subsequent compatible transitions into same segment', function() {
    var path = createPath()
      .add(Immutable.fromJS({requires: {}, provides: {foo: true}}))
      .add(Immutable.fromJS({requires: {}, provides: {bar: true}}))
      .toRaw();

    expect(path).to.equal(Immutable.List([
      Immutable.Set([
        Immutable.fromJS({requires: {}, provides: {foo: true}}),
        Immutable.fromJS({requires: {}, provides: {bar: true}})
      ])
    ]));
  });

  it('should not merge grandchild compatible transitions', function() {
    var path = createPath()
      .add(Immutable.fromJS({requires: {}, provides: {foo: true}}))
      .add(Immutable.fromJS({requires: {foo: true}, provides: {bar: true}}))
      .add(Immutable.fromJS({requires: {bar: true}, provides: {baz: true}}))
      .add(Immutable.fromJS({requires: {foo: true}, provides: {qux: true}}))
      .toRaw();

    expect(path).to.equal(Immutable.List([
      Immutable.Set([
        Immutable.fromJS({requires: {}, provides: {foo: true}}),
      ]),
      Immutable.Set([
        Immutable.fromJS({requires: {foo: true}, provides: {bar: true}})
      ]),
      Immutable.Set([
        Immutable.fromJS({requires: {bar: true}, provides: {baz: true}}),
        Immutable.fromJS({requires: {foo: true}, provides: {qux: true}})
      ]),
    ]));
  });
});
