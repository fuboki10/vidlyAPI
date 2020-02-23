const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const moment = require('moment');

module.exports = {
	returnRental: async (req, res) => {
		const { error } = validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const rental = await Rental.findOne();

		if (!rental) return res.status(404).send('Rental is not found.');

		if (rental.dateReturned)
			return res.status(400).send('Rental already processed');

		rental.dateReturned = new Date();
		const rentalDays = moment().diff(rental.dateOut, 'days');
		rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

		const movie = await Movie.findOne();

		movie.numberInStock += 1;

		await movie.save();
		await rental.save();

		res.status(200).send(rental);
		// Returns 400 if customerId is not provided
		// Returns 400 if movieId is not provided
		// Returns 404 if not rental found for this customer/movie
		// Returns 400 if rental already processed
		// Returns 200 if valid request
		// Set the return date
		// Calculate the rental fee (numberOfDays * movie.dailyRentalRate)
		// Increase the stock
		// Returns the rental
	}
};
