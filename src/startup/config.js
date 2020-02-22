module.exports = function () {
  if (!process.env.jwtPrivateKey) {
    throw Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }

  if (!process.env.vidly_db) {
    throw Error('FATAL ERROR: DB url is not defined.');
  }
}