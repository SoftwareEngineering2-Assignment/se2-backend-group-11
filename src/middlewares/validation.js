const {schemas: validationSchemas} = require('../utilities/validation');

module.exports = async (req, res, next, schema) => {
  /**
     * @name validation
     * @description Middleware that tests the validity of a body given a specified schema
     * @param req HTTP request argument to the middleware function, called "req" by convention.
     * @param res HTTP response argument to the middleware function, called "res" by convention.
     * @param next Callback argument to the middleware function, called "next" by convention.
     * @param schema defines the shape of documents inside a particular collection.
     */
  try {
    const {body} = req;
    await validationSchemas[schema].validate(body);
    next();
  } catch (err) {
    next({
      message: `Validation Error: ${err.errors[0]}`,
      status: 400
    });
  }
};
