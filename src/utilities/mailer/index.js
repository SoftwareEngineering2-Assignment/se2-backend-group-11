const password = require('./password');
const send = require('./send');

// Make password and send available throughout the project
module.exports = {
  mail: password,
  send
};
