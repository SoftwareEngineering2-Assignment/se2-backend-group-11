const {isNil} = require('ramda');

const yup = require('yup');
const {min} = require('./constants');

// Define format for emails.
const email = yup
  .string()
  .lowercase()
  .trim()
  .email();

// Define format for usernames.
const username = yup
  .string()
  .trim();

// Define format for passwords.
const password = yup
  .string()
  .trim()
  .min(min);

const request = yup.object().shape({username: username.required()});

// An authentication object that requires a username and password.
const authenticate = yup.object().shape({
  username: username.required(),
  password: password.required()
});

// A registration object that requires a username, password and email.
const register = yup.object().shape({
  email: email.required(),
  password: password.required(),
  username: username.required()
});

// A user information update object that requires a username and password.
const update = yup.object().shape({
  username,
  password
}).test({
  message: 'Missing parameters',
  test: ({username: u, password: p}) => !(isNil(u) && isNil(p))
});

// A password update object that requires a new password.
const change = yup.object().shape({password: password.required()});

// Make authenticate, register, request, change, update available throughout the project
module.exports = {
  authenticate, register, request, change, update
};
