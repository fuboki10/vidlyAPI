const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

// API Functions
router.get('/', async (req, res) => {
  const name = req.query.q || '';
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 0;

  const customers = await Customer.find({ name: {$regex: name, $options: 'i'} })
    .sort('name')
    .limit(limit)
    .skip(page * limit)
    ;
    
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('The Customer with the given ID is not found');

  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });

  customer = await customer.save();
  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!customer) return res.status(404).send('The Customer with the given ID is not found');

  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The Customer with the given ID is not found');

  res.send(customer);
});

// Exports
module.exports = router;