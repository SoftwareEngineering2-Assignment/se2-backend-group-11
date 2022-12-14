/**
 * The code defines a set of tests for a JavaScript program using the ava testing library.
 * To run these tests, you would need to use the ava command-line interface and specify the file
 * containing the tests as an argument.
 */

/* eslint-disable import/no-unresolved */
const test = require('ava').default;

/**
 *  this is a simple test that always passes. It has one assertion, t.pass(), that checks that
 *  the test has run successfully.
 */
test('Test to pass', (t) => {
  t.pass();
});

/**
 * this test uses the t.is() assertion to check that the result of adding 1 to the value of the a
 * variable is equal to 2.
 */
test('Test value', async (t) => {
  const a = 1;
  t.is(a + 1, 2);
});

const sum = (a, b) => a + b;

/**
 * This test checks the result of calling the sum() function with the arguments 1 and 2. It uses
 * the t.plan() method to specify that the test contains two assertions.
 */
test('Sum of 2 numbers', (t) => {
  t.plan(2);
  t.pass('this assertion passed');
  t.is(sum(1, 2), 3);
});
