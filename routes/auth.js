const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) 
    return res.status(400).send('Invalid Username or Password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Username or Password.');

  res.send(true);
});

function validate(user) {
  const schema = {
    username: Joi.string().required().min(5).max(50),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}
module.exports = router;