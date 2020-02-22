const { Genre, validate } = require('../models/genre');

module.exports = {
  getGenres : async (req, res) => {
    const name = req.query.q || '';
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;

    const genres = await Genre
      .find({ name: {$regex: name, $options : 'i'} })
      .limit(limit)
      .skip(page * limit)
      ;
    
    res.send(genres);
  },

  getGenreById: async (req, res) => {
    /**@type Genre */ const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The Genre with the given ID is not found');
    res.send(genre);
  },

  createGenre: async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();
    res.send(genre);
  },

  updateGenre: async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!genre) return res.status(404).send('The Genre with the given ID is not found');

    res.send(genre);
  },

  deleteGenre: async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The Genre with the given ID is not found');

    res.send(genre);
  }
};