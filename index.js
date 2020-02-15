const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://localhost/vidly')
    .then((result) => console.log('Connected to db...'))
    .catch((err) => console.error('Error : ', err.message));

const genres = require('./routes/genres');

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    return console.log(`listening on port ${port}...`);
});