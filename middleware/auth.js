const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No Token Provieded.');

  try {
    const payload = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = payload;
    next();
  } catch (ex) {
    return res.status(400).send('Invalid token.');
  }
}

module.exports = auth;