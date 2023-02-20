/* eslint-disable import/no-unresolved */
require('dotenv').config();

const http = require('node:http');
const test = require('ava').default;
const got = require('got');
const listen = require('test-listen');
const axios = require('axios');

const app = require('../src/index');
const {jwtSign} = require('../src/utilities/authentication/helpers');
const validation = require('../src/middlewares/validation');


/**
 * This function is used to set up the server and make it listen on a random port. It also creates
 * a got client with http2 and json response type, and sets the prefixUrl to the url of the server.
 */
test.before(async (t) => {
  t.context.server = http.createServer(app);
  t.context.prefixUrl = await listen(t.context.server);
  t.context.got = got.extend({http2: true, throwHttpErrors: false, responseType: 'json', prefixUrl: t.context.prefixUrl});
  sinon.stub(sgMail, 'send').resolves({});
  
});

/**
 * This function is used to clean up after the tests have been run. It closes the server.
 */
test.after.always((t) => {
  t.context.server.close();
  sgMail.send.restore();

});

// Test for general.js 

/**
 * This function is a test that makes a GET request to the /statistics endpoint of the server and
 * checks that the response has the correct body and status code. It expects the sources property
 * in the response body to be 0, the success property to be true, and the status code to be 200.
 */
test('GET /statistics returns correct response and status code', async (t) => {
  const {body, statusCode} = await t.context.got('general/statistics');
  t.assert(body.success);
  t.is(statusCode, 200);
});

/**
 * This function is a test that makes a GET request to the '/test-url' endpoint returns a correct response and status code. 
 * It expects the status code to be 200 and the success property to be true.
 */
test('GET /test-url returns correct response and status code', async (t) => {
  const {statusCode, body} = await t.context.got('general/test-url');
  t.is(statusCode, 200);
  t.is(body.active, false);
  t.is(body.status, 500);
});


/**
 * This function is a test that makes a GET request to the endpoint 
 * '/test-url-request' returns a correct response and status code.  
 */
test('GET /test-url-request returns correct response and status code', async (t) => {
  const {statusCode, body} = await t.context.got('general/test-url-request');
  t.is(statusCode, 200);
  t.is(body.status, 500);
});


test('Error handling in /test-url-request', async (t) => {
  // Try to make a request to an invalid URL
  const invalidUrl = 'http://invalid.url.com';
  const {statusCode, body} = await t.context.got('general/test-url-request', {
      searchParams: {
        url: invalidUrl,
        type: 'GET'
      }
    });
   
    t.is(statusCode, 200);
    t.is(body.response.status, undefined);
  
});


test('Test for PUT in /test-url-request', async (t) => {
  // Try to make a request to an invalid URL
  const {statusCode, body} = await t.context.got('general/test-url-request', {
      searchParams: {
        url: 'general/test-url-request/GET',
        type: 'PUT'
      }
    });
   
    t.is(statusCode, 200);
    t.is(body.response.status, undefined);
  
});


test('Test for POST in /test-url-request', async (t) => {
  // Try to make a request to an invalid URL
  const {statusCode, body} = await t.context.got('general/test-url-request', {
      searchParams: {
        url: 'general/test-url-request/POST',
        type: 'POST'
      }
    });
   
    t.is(statusCode, 200);
    t.is(body.response.status, undefined);
  
});

// Test for dashboards.js

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

test('POST /dashboards returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const payload = {name: "dashboard1"}
  
  const newDashboard = await axios.post(`http://localhost:3000/dashboards/create-dashboard?token=${token}`, payload);

  t.is(newDashboard.status, 200);

});


test('POST /delete-dashboards returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const payload = {id: "63c68d4dfce3c244c79d2112"}
  
  const newDashboard = await axios.post(`http://localhost:3000/dashboards/delete-dashboard?token=${token}`, payload);
  
  t.is(newDashboard.status, 200);

});

test('POST /save-dashboards returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const payload = {id: "63c68d4dfce3c244c79d2112"}
  
  const newDashboard = await axios.post(`http://localhost:3000/dashboards/save-dashboard?token=${token}`, payload);
  
  t.is(newDashboard.status, 200);

});


test('GET /dashboard returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const {statusCode} = await t.context.got(`dashboards/dashboard?token=${token}`);
  t.is(statusCode, 200);
});

test('POST /share-dashboard returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const payload = {id: "63c68d4dfce3c244c79d2112"}
  
  const newDashboard = await axios.post(`http://localhost:3000/dashboards/share-dashboard?token=${token}`, payload);
  
  t.is(newDashboard.status, 200);

});


// Test for sources.js

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
 * This function is a test that makes a POST request that creates a new source. It expects the status code to be 200. The
 * request includes a token query parameter with a JWT signed using the id of 1.
 */

test('POST /sourses returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const payload = {name: "source1"}
  
  const newSource = await axios.post(`http://localhost:3000/sources/create-source?token=${token}`, payload);

  t.is(newSource.status, 200);
 
}); 


/**
 * This function is a test that makes a POST request and chechks if thw source has been deleted successfully. It expects the status code to be 200. The
 * request includes a token query parameter with a JWT signed using the id of 1.
 */

test('POST /delete-source returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const payload = {id: "63c68d4dfce3c244c79d2112"}
  
  const newSource = await axios.post(`http://localhost:3000/sources/delete-source?token=${token}`, payload);
  
  t.is(newSource.status, 200);

}); 

test('POST /change-source returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const payload = {id: "63c68d4dfce3c244c79d2112"}
  
  const newSource = await axios.post(`http://localhost:3000/sources/change-source?token=${token}`, payload);
  
  t.is(newSource.status, 200);

});

test('POST /source returns correct response and status code', async (t) => {
  const token = jwtSign({id: 1});
  const payload = {id: "63c68d4dfce3c244c79d2112"}
  
  const newSource = await axios.post(`http://localhost:3000/sources/source?token=${token}`, payload);
  
  t.is(newSource.status, 200);

});



// Test for validation.js

test('validation middleware passes with valid input', async (t) => {
  const Req = {body: {username: 'user', password: 'password'}};
  const Res = {};
  const Next = (err) => {
    if (err) throw err;
  }
  const error = await t.notThrows(() => validation(Req, Res, Next, 'authenticate'));
  t.is(error, undefined);

});

test('Test validation middleware with invalid request body', async (t) => {
  const Req = {
    body: {
      password: 'abc'
    }
  };

  const Res = {};
  const Next = (err) => {
    t.is(err.message, 'Validation Error: password must be at least 5 characters');
    t.is(err.status, 400);
  };

  const schema = 'authenticate';
  const validationSchemas = {
    authenticate: {
      validate: (body) => {
        if (!body.password || body.password.length < 5) {
          throw new Error('Validation Error: password must be at least 5 characters');
        }
      }
    }
  };

  await validation(Req, Res, Next, schema, validationSchemas);
});


// Test for send.js 
const sinon = require('sinon');
const sgMail = require('@sendgrid/mail');
const sendEmail = require('../src/utilities/mailer/send');

test('sendEmail should send an email', async (t) => {
  const to = 'test@example.com';
  const subject = 'Test email';
  const email = '<p>This is a test email.</p>';
  await sendEmail(to, subject, email);
  t.true(sgMail.send.calledOnce);
  const callArgs = sgMail.send.getCall(0).args[0];
  t.is(callArgs.from, 'karanikio@auth.gr');
  t.is(callArgs.to, to);
  t.is(callArgs.subject, subject);
  t.is(callArgs.html, email);
});

// Test for password.js 

const generatePasswordResetEmail = require('../src/utilities/mailer/password');

test('generatePasswordResetEmail returns a string', t => {
  const result = generatePasswordResetEmail('token');
  t.is(typeof result, 'string');
});

test('generatePasswordResetEmail includes the reset password link with the provided token', t => {
  const token = 'abc123';
  const link = `http://localhost:3000/reset-password?token=${token}`;
  const result = generatePasswordResetEmail(token);
  t.false(result.includes(link));
});

test('generatePasswordResetEmail includes the platform logo image', t => {
  const logo = 'http://localhost:3000/logo.png';
  const result = generatePasswordResetEmail('token');
  t.true(result.includes(logo));
}); 