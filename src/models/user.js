/* eslint-disable func-names */
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const {passwordDigest, comparePassword} = require('../utilities/authentication/helpers');
const {constants: {min}} = require('../utilities/validation');

mongoose.pluralize(null);

/**
 * This function creates a new Mongoose schema for a user with the following properties:
 * email: a string that must be unique, required, lowercase, and indexed.
 * username: a string that must be unique, required, and indexed.
 * password: a string that must be required, have a minimum length specified by min, and not be
 * included in the default selection of fields.
 * registrationDate: a number representing the date when the user registered.
 */
const UserSchema = new mongoose.Schema(
  {
    email: {
      index: true,
      type: String,
      unique: 'A user already exists with that email!',
      required: [true, 'User email is required'],
      lowercase: true
    },
    username: {
      index: true,
      type: String,
      unique: 'A user already exists with that username!',
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
      select: false,
      minlength: min
    },
    registrationDate: {type: Number}
  }
);

// Plugin for Mongoose that turns duplicate errors into regular Mongoose validation errors.

UserSchema.plugin(beautifyUnique);

/**
 * This function is a Mongoose middleware that is run before a user document is saved to the
 * database. It does the following:
 * If the user's password has been modified, it hashes the password using the passwordDigest
 * function.
 * If the user's email or username has been modified, it sets the registrationDate to the current
 * time.
 */
UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = passwordDigest(this.password);
  }
  if (this.isModified('email') || this.isModified('username')) {
    this.registrationDate = Date.now();
  }
  return next();
});

// Model method that compares hashed passwords

UserSchema.methods.comparePassword = function (password) {
  return comparePassword(password, this.password);
};

module.exports = mongoose.model('users', UserSchema);
