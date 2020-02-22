const winston = require('winston');
const express = require('express');
const app = express();
require('express-async-errors');

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();


// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    return winston.info(`listening on port ${port}...`);
});
