const winston = require('winston');
const { format } = winston;
// require('winston-mongodb');

module.exports = function () {
  winston.exitOnError = false;
  const myFormat = format.printf(({level, message, timestamp}) => {
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
    format: format.combine(
      format.colorize(),
      format.prettyPrint(),
      format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      format.label(),
      format.json(),
      myFormat
    ),
    level: 'info'
  }));
  /*winston.add(new winston.transports.MongoDB({ 
    db: process.env.vidly_db,
    level: 'error',
    options: { useUnifiedTopology: true }
  }));*/
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
}