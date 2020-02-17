const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');

router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(id);
    if (!user) return res.status(404).send('The User with the given ID is not found');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    user = await user.save();
    res.send(user);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    if (!user) return res.status(404).send('The user with the given ID is not found');

    res.send(user);
});

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID is not found');

    res.send(user);
});

module.exports = router;