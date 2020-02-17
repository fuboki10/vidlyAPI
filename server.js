const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://localhost/vidly')
    .then((result) => console.log('Connected to db...'))
    .catch((err) => console.error('Error : ', err.message));

// Get the Routes
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

// App Middleware Functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    return console.log(`listening on port ${port}...`);
});