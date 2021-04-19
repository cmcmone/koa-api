const mongoose = require('mongoose');

const uri = require('../config/keys').mongodbURI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected');
});

/**
 * error
 */
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});

/**
 * disconnected
 */
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected');
});

module.exports = mongoose;
