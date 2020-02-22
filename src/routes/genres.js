const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const genreController = require('../controllers/genre.controller');

/**
 * @public
 * @returns array of Genres
 * @param {req} Request
 * @param {res} Response
 */
router.get('/', genreController.getGenres);

/**
 * @public
 * @returns genre with the given id
 * @param {req} Request
 * @param {res} Response
 * @param {id} genreId
 */
router.get('/:id', genreController.getGenreById);

router.post('/', auth, genreController.createGenre);

router.put('/:id', genreController.updateGenre);

router.delete('/:id', [auth, admin], genreController.deleteGenre);

module.exports = router;