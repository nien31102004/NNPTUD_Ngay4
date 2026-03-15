const express = require('express');
const router = express.Router();
const User = require('../schemas/users');

router.get('/', async (req, res) => {
  const users = await User.find({ isDeleted: false }).populate('role');
  res.send(users);
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName || '',
      avatarUrl: req.body.avatarUrl || 'https://i.sstatic.net/l60Hf.png',
      status: req.body.status ?? false,
      role: req.body.role,
      loginCount: req.body.loginCount ?? 0
    });
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    };
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('role');
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/enable', async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) return res.status(400).send({ message: 'email and username required' });
    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: true },
      { new: true }
    );
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/disable', async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) return res.status(400).send({ message: 'email and username required' });
    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: false },
      { new: true }
    );
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
