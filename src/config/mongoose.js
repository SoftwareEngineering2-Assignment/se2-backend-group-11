const mongoose = require('mongoose');

/**
 * The mongooseOptions object specifies a number of options for the MongoDB connection.
 * These options include:
 * useNewUrlParser: tells Mongoose to use the new URL parser.
 * useCreateIndex: tells Mongoose to use the new createIndex() function, which is more
 * efficient than the legacy ensureIndex() function.
 * useFindAndModify: tells Mongoose to use the new findOneAndUpdate() function, which
 * is more efficient than the legacy findAndModify() function.
 * useUnifiedTopology: tells Mongoose to use the new unified topology engine.
 * poolSize: sets the maximum size of the connection pool for the MongoDB server.
 * keepAlive: enables a keep-alive connection for the MongoDB server.
 * keepAliveInitialDelay: This option sets the initial delay for the keep-alive connection.
 */
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  poolSize: 100,
  keepAlive: true,
  keepAliveInitialDelay: 300000
};
const mongodbUri = process.env.MONGODB_URI;

/**
 * The module exports a function that creates a connection to a MongoDB database specified by the
 * MONGODB_URI environment variable. The connection is established using the mongoose.connect()
 * method, passing in the mongodbUri and mongooseOptions objects as arguments.
 */
module.exports = () => {
  // eslint-disable-next-line no-console
  mongoose.connect(mongodbUri, mongooseOptions).catch(console.error);
};
