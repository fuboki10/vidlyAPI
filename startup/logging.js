const winston = require('winston');
const config = require('config');
require('winston-mongodb');

module.exports = function () {
  winston.exitOnError = false;
  const myFormat = winston.format.printf(({level, message, timestamp}) => {
    return `${timestamp} ${level}: ${message}`;
  })
  winston.exceptions.handle(
    new winston.transports.File({ 
      filename: './logs/uncaughtException.log',
    })
  );
  winston.add(new winston.transports.File({ 
    filename: './logs/logfile.log',
    level: 'error'
  }));
  winston.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.prettyPrint(),
      winston.format.timestamp(),
      winston.format.label(),
      myFormat
    ),
    level: 'info'
  }));
  winston.add(new winston.transports.MongoDB({ 
    db: config.get('db'),
    level: 'error',
    options: { useUnifiedTopology: true }
  }));
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
}