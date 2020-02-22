const winston = require('winston');
const express = require('express');
const app = express();
const config = require('config');
require('express-async-errors');

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();


// Listen to port
const port = config.get('PORT') || 3000;
const server = app.listen(port, () => {
    return winston.info(`listening on port ${port}...`);
});

module.exports = server;
