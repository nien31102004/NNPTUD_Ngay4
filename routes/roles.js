const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');
const User = require('../schemas/users');

router.get('/', async (req, res) => {
  const roles = await Role.find({ isDeleted: false });
  res.send(roles);
});

router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) return res.status(404).send({ message: 'Role not found' });
    res.send(role);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newRole = new Role({
      name: req.body.name,
      description: req.body.description || ''
    });
    await newRole.save();
    res.send(newRole);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Role.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send({ message: 'Role not found' });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Role.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!deleted) return res.status(404).send({ message: 'Role not found' });
    res.send(deleted);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.get('/:id/users', async (req, res) => {
  try {
    const roleId = req.params.id;
    const users = await User.find({ role: roleId, isDeleted: false });
    res.send(users);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
