const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

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

  const user = new User(_.pick(req.body, ['username', 'email', 'password', 'isAdmin']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'email']));
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send('The User with the given ID is not found');
  
  res.send(user);
});

module.exports = router;