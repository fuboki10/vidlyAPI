const winston = require('winston');

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  res.status(err.statusCode || 500).send(err);
}