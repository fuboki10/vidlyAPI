const config = require('config');

module.exports = function () {
  if (!config.get('jwtPrivateKey')) {
    throw Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }

  if (!config.get('db')) {
    throw Error('FATAL ERROR: DB url is not defined.');
  }
}