const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @public
 * @returns array of Genres
 * @param {req} Request
 * @param {res} Response
 */
router.get('/', async (req, res) => {
    const name = req.query.q || '';
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;

    const genres = await Genre
        .find({ name: {$regex: name, $options : 'i'} })
        .limit(limit)
        .skip(page * limit)
        ;
    
    res.send(genres);
});

/**
 * @public
 * @returns genre with the given id
 * @param {req} Request
 * @param {res} Response
 * @param {id} genreId
 */
router.get('/:id', async (req, res) => {
    /**@type Genre */ const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The Genre with the given ID is not found');
    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!genre) return res.status(404).send('The Genre with the given ID is not found');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The Genre with the given ID is not found');

    res.send(genre);
});

module.exports = router;