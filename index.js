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

// App Middleware Functions
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    return console.log(`listening on port ${port}...`);
});