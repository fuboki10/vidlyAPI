require('express-async-errors');
const config = require('config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const winston = require('winston');
require('winston-mongodb');

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

if (!config.get('db')) {
    console.error('FATAL ERROR: DB url is not defined.');
    process.exit(2);
}

// To Fix mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ 
    db: config.get('db'),
    level: 'error',
    options: { useUnifiedTopology: true }
}));

// Connect to db
mongoose.connect(config.get('db'))
    .then((result) => console.log('Connected to db...'))
    .catch((err) => console.error('Error : ', err.message));


// Get the Routes
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

// App Middleware Functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(errorHandler);

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    return console.log(`listening on port ${port}...`);
});