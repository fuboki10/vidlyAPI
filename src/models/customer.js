const mongoose = require('mongoose');
const Joi = require('joi');

// Create Customer Model
/**
 * @public
 * @param {name} name string
 * @param {isGold} isGold Boolean
 * @param {phone} phone string
 */
const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  }
}));

// Validation Functions
function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(20).required()
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;