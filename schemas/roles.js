const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: [true, "name must be unique"]
  },
  description: {
    type: String,
    default: ""
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
