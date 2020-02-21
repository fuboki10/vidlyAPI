const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  // To Fix mongoose deprecation warnings
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  // Connect to db
  winston.info(process.env.vidly_db);
  mongoose.connect(process.env.vidly_db)
    .then(() => winston.info('Connected to db...'))
    .catch((err) => winston.error('Cannot Connect to db! ', err));
}
