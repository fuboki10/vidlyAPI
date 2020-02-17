const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

async function isEmailExisted(email) {
  let user = await User.findOne({ email: email });
  return user !== null;
}

async function isUsernameExisted(username) {
  let user = await User.findOne({ username: username });
  return user !== null;
}

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (await isEmailExisted(req.body.email) || await isUsernameExisted(req.body.username)) 
    return res.status(400).send('User already registered.');

  const user = new User(_.pick(req.body, ['username', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ['_id', 'username', 'email']));
});

module.exports = router;