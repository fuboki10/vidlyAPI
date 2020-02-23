const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
  // To Fix mongoose deprecation warnings
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  // Connect to db
  const db = config.get('db');
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`))
    .catch((err) => winston.error(`Cannot Connect to ${db}! `, err));
}
