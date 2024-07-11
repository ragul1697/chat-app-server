// backend/routes/auth.js
const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  if(username === null) return res.status(404).send('Invalid User details');
  const user = new User({ username, password, isAdmin: isAdmin });
  await user.save();
  res.send(user);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).send('User not found');
  return res.status(200).send({ status: 1, data: user, message: 'Login Successfull' })
});

router.get('/users', async (req, res) => {
  const userList = await User.find({});
  return res.status(200).send({ status: 1, data: userList});
})

module.exports = router;