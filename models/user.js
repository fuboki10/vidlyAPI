const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  }
});

const User = mongoose.model('User', userSchema);

function validate(user) {
  const schema = {
    username: Joi.string().required().min(5).max(50),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validate;