var Immutable = require('immutable');
var bitFlipTransitions = require(__dirname + '/../transitions');
var bitFlipVerifications = require(__dirname + '/../verifications');

module.exports = {
  transitions: Immutable.fromJS(bitFlipTransitions),
  verifications: Immutable.fromJS(bitFlipVerifications)
};
