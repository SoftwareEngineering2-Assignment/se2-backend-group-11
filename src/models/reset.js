/* eslint-disable func-names */
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const {constants: {expires}} = require('../utilities/validation');

const ResetSchema = new mongoose.Schema({
  /**
   * The ResetSchema constant represents a new Mongoose schema for a password reset token. It has
   * three fields:
   * username: a string that is required and must be unique. It is indexed and lowercase.
   * token: a string that is required.
   * expireAt: a date that is the default value of the current time. It is indexed with an
   * expiration.
   */
  username: {
    index: true,
    type: String,
    required: true,
    unique: 'A token already exists for that username!',
    lowercase: true
  },
  token: {
    type: String,
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {expires},
  },
});

// Plugin for Mongoose that turns duplicate errors into regular Mongoose validation errors.

ResetSchema.plugin(beautifyUnique);

mongoose.pluralize(null);
module.exports = mongoose.model('reset-tokens', ResetSchema);
