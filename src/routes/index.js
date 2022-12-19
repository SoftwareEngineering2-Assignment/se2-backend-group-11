const express = require('express');
const users = require('./users');
const sources = require('./sources');
const dashboards = require('./dashboards');
const general = require('./general');
const root = require('./root');

const router = express.Router();

// users: This middleware function is used to handle requests to the /users endpoint.
router.use('/users', users);
// sources: This middleware function is used to handle requests to the /sources endpoint.
router.use('/sources', sources);
// dashboards: This middleware function is used to handle requests to the /dashboards endpoint.
router.use('/dashboards', dashboards);
// general: This middleware function is used to handle requests to the /general endpoint.
router.use('/general', general);
// root: This middleware function is used to handle requests to the / (root) endpoint.
router.use('/', root);

// The router is exported, so that it can be used in other parts of the express.js server.
module.exports = router;
