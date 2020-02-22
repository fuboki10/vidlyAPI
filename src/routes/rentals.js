const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(mongoose);

function createRentalFromMovieAndCustomer(movie, customer) {
  var rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  return rental;
}

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateout');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('Invalid Customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('Invalid Movie.');

  let rental = createRentalFromMovieAndCustomer(movie, customer);
  
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send('Something faild.');
  }
});

module.exports = router;