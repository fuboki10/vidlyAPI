const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    set: num => Math.round(num),
    get: num => Math.round(num)
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    set: num => Math.round(num),
    get: num => Math.round(num)
  }
});

const Movie = mongoose.model('Movie', movieSchema);

function validate(movie) {
  const schema = {
    title: Joi.string().min(1).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required()
  };

  return Joi.validate(movie, schema);
};

exports.Movie = Movie;
exports.validate = validate;