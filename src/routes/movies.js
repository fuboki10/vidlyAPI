const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', movieController.getMovies);

router.get('/:id', validateObjectId, movieController.getMoviesById);

router.post('/', movieController.createMovie);

router.put('/:id', validateObjectId, movieController.updateMovie);

router.delete('/:id', validateObjectId, movieController.deleteMovie);

module.exports = router;