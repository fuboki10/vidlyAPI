// POST /api/returns {customerId, movieId}

// Returns 400 if customerId is not provided
// Returns 400 if movieId is not provided
// Returns 404 if not rental found for this customer/movie
// Returns 400 if rental already processed
// Returns 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Returns the rental
const moment = require('moment');
const returnController = require('../../../src/controllers/return.controller');
const { Rental } = require('../../../src/models/rental');
const { Movie } = require('../../../src/models/movie');
const mongoose = require('mongoose');

describe('/api/returns', () => {
	let rental;
	let movie;
	beforeEach(() => {
		movie = new Movie({
			title: '12345',
			numberInStock: 10,
			dailyRentalRate: 2,
			genre: {
				name: '12345'
			}
		});
		movie.save = jest.fn().mockResolvedValue(null);
		Movie.findOne = jest.fn().mockResolvedValue(movie);

		rental = new Rental({
			customer: {
				name: '12345',
				phone: '12345'
			},
			movie: {
				title: movie.title,
				dailyRentalRate: movie.dailyRentalRate
			}
		});
		rental.save = jest.fn().mockResolvedValue(null);
		Rental.findOne = jest.fn().mockResolvedValue(rental);
	});

	const mockResponse = () => {
		const res = {};
		res.status = jest.fn().mockReturnValue(res);
		res.json = jest.fn().mockReturnValue(res);
		res.send = jest.fn().mockReturnValue(res);
		return res;
	};

	const mockRequest = (data) => {
		const req = {};
		req.body = data;
		return req;
	};

	it('should return 400 if customerId is not provided', async () => {
		const req = mockRequest({
			movieId: '12345'
		});
		const res = mockResponse();
		returnController.returnRental(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('should return 400 if movieId is not provided', async () => {
		const req = mockRequest({
			customerId: '12345'
		});
		const res = mockResponse();
		returnController.returnRental(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('should return 404 if rental is not found', async () => {
		const req = mockRequest({
			customerId: mongoose.Types.ObjectId().toHexString(),
			movieId: mongoose.Types.ObjectId().toHexString()
		});
		const res = mockResponse();
		Rental.findOne = jest.fn().mockResolvedValue(null);
		await returnController.returnRental(req, res);

		expect(Rental.findOne).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(404);
	});

	it('should return 400 if rental already processed', async () => {
		Rental.findOne = jest.fn().mockResolvedValue(rental);

		const req = mockRequest({
			customerId: mongoose.Types.ObjectId().toHexString(),
			movieId: mongoose.Types.ObjectId().toHexString(),
			dateReturned: new Date()
		});
		const res = mockResponse();

		await returnController.returnRental(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});

	it('should return 200 if input is valid', async () => {
		Rental.findOne = jest.fn().mockResolvedValue(rental);

		const req = mockRequest({
			customerId: mongoose.Types.ObjectId().toHexString(),
			movieId: mongoose.Types.ObjectId().toHexString()
		});
		const res = mockResponse();

		await returnController.returnRental(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
	});

	it('should Set the return date if input is valid', async () => {
		Rental.findOne = jest.fn().mockResolvedValue(rental);

		const req = mockRequest({
			customerId: mongoose.Types.ObjectId().toHexString(),
			movieId: mongoose.Types.ObjectId().toHexString()
		});
		const res = mockResponse();

		await returnController.returnRental(req, res);

		expect(rental.dateReturned).toBeDefined();
		const diff = new Date() - rental.dateReturned;
		expect(diff).toBeLessThan(10);
	});

	it('should Calculate the rental fee if input is valid', async () => {
		rental.dateOut = moment()
			.add(-7, 'days')
			.toDate();

		Rental.findOne = jest.fn().mockResolvedValue(rental);

		const req = mockRequest({
			customerId: mongoose.Types.ObjectId().toHexString(),
			movieId: mongoose.Types.ObjectId().toHexString()
		});
		const res = mockResponse();

		await returnController.returnRental(req, res);

		expect(rental.save).toHaveBeenCalledTimes(1);
		expect(rental.rentalFee).toBe(7 * movie.dailyRentalRate);
	});

	it('should Increase the stock if input is valid', async () => {
		rental.dateOut = moment()
			.add(-7, 'days')
			.toDate();

		const req = mockRequest({
			customerId: mongoose.Types.ObjectId().toHexString(),
			movieId: mongoose.Types.ObjectId().toHexString()
		});
		const res = mockResponse();

		const oldMovieNumberInStock = movie.numberInStock;

		await returnController.returnRental(req, res);

		expect(movie.save).toHaveBeenCalledTimes(1);
		expect(movie.numberInStock).toBe(oldMovieNumberInStock + 1);
	});

	it('should Return the rental if input is valid', async () => {
		rental.dateOut = moment()
			.add(-7, 'days')
			.toDate();

		const req = mockRequest({
			customerId: mongoose.Types.ObjectId().toHexString(),
			movieId: mongoose.Types.ObjectId().toHexString()
		});
		const res = mockResponse();

		await returnController.returnRental(req, res);

		expect(res.send).toBeCalledWith(rental);
	});
});
