const express = require('express');
const router = express.Router();
const { Movie , validate } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
  const movies = await Movie.find()
    .sort('title')
    .select('-genre.__v -genre._id -__v')
    ;

  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('The Movie with the given ID is not found');
    res.send(movie);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send('The Genre with the given ID is not found');

  let movie = new Movie({
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  movie = await movie.save();
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!movie) return res.status(404).send('The Movie with the given ID is not found');

  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  
  if (!movie) return res.status(404).send('The Movie with the given ID is not found');

  res.send(movie);
});

module.exports = router;