const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = function () {
  // To Fix mongoose deprecation warnings
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  // Connect to db
  mongoose.connect(config.get('db'))
    .then((result) => winston.info('Connected to db...'))
    .catch((err) => console.log('aaaaaaaaaaaaaaaaaaa'));
}
