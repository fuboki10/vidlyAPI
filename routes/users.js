const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const debug = require('debug')('app:debug');
const _ = require('lodash');

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

  await user.save();

  res.send(_.pick(user, ['_id', 'username', 'email']));
});

module.exports = router;