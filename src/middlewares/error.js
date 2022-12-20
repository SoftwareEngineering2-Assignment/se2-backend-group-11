/* eslint-disable no-console */
const {pipe, has, ifElse, assoc, identity, allPass, propEq} = require('ramda');

const withFormatMessageForProduction = ifElse(
  allPass([propEq('status', 500), () => process.env.NODE_ENV === 'production']),
  assoc('message', 'Internal server error occurred.'),
  identity
);

/**
 * @name error
 * @description Middleware that handles errors
 * @param error possible format:
 * { code: <error code>,
 *   type: <error type>,
 *   error: <error message> }
 * @param res HTTP response argument to the middleware function, called "res" by convention.
 */
// eslint-disable-next-line no-unused-vars
module.exports = (error, _0, res, _1) =>
  pipe(
    (e) => ({...e, message: e.message}),
    ifElse(has('status'), identity, assoc('status', 500)),
    withFormatMessageForProduction,
    (fError) => res.status(fError.status).json(fError)
  )(error);
