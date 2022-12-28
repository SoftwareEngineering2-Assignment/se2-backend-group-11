/* eslint-disable import/no-unresolved */
require('dotenv').config();

const http = require('node:http');
const test = require('ava').default;
const got = require('got');
const listen = require('test-listen');
const request= require('request');

const app = require('../src/index');
const {jwtSign} = require('../src/utilities/authentication/helpers');

/**
 * This function is used to set up the server and make it listen on a random port. It also creates
 * a got client with http2 and json response type, and sets the prefixUrl to the url of the server.
 */
test.before(async (t) => {
  t.context.server = http.createServer(app);
  t.context.prefixUrl = await listen(t.context.server);
  t.context.got = got.extend({http2: true, throwHttpErrors: false, responseType: 'json', prefixUrl: t.context.prefixUrl});
  t.context.request = request;
});

/**
 * This function is used to clean up after the tests have been run. It closes the server.
 */
test.after.always((t) => {
  t.context.server.close();
});

/**
 * This function is a test that makes a GET request to the /statistics endpoint of the server and
 * checks that the response has the correct body and status code. It expects the sources property
 * in the response body to be 0, the success property to be true, and the status code to be 200.
 */
test('GET /statistics returns correct response and status code', async (t) => {
  const {body, statusCode} = await t.context.got('general/statistics');
  t.is(body.sources, 0);
  t.assert(body.success);
  t.is(statusCode, 200);
  t.is(body.views, 0);
});

/**
 * This function is a test that makes a GET request to the /sources endpoint of the server and
 * checks that the response has the correct status code. It expects the status code to be 200. The
 * request includes a token query parameter with a JWT signed using the id of 1.
 */
test('GET /sources returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const {statusCode} = await t.context.got(`sources/sources?token=${token}`);
  t.is(statusCode, 200);
});

/**
 * This function is a test that makes a GET request to the /dashboards endpoint of the server and
 * checks that the response has the correct status code. It expects the status code to be 200 and the success property to be true.
 * The request includes a token query parameter with a JWT signed using the id of 1.
 */
test('GET /dashboards returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const {statusCode, body} = await t.context.got(`dashboards/dashboards?token=${token}`);
  t.is(statusCode, 200);
  t.assert(body.success);
});




test('GET /test-url returns correct response and status code', async (t) => {
  const {statusCode} = await t.context.got('general/test-url');
  t.is(statusCode, 200);
});






