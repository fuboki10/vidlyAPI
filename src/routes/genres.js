const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const genreController = require('../controllers/genre.controller');
const validateObjectId = require('../middleware/validateObjectId');

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
router.get('/:id', [
  validateObjectId, 
  genreController.getGenreById
]);

router.post('/', [
  auth, 
  genreController.createGenre
]);

router.put('/:id', [
  validateObjectId, 
  genreController.updateGenre
]);

router.delete('/:id', [
  validateObjectId,
  auth, 
  admin, 
  genreController.deleteGenre
]);

module.exports = router;