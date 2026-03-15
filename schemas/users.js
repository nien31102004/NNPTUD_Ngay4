const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: [true, 'username must be unique']
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email must be unique']
  },
  fullName: {
    type: String,
    default: ""
  },
  avatarUrl: {
    type: String,
    default: "https://i.sstatic.net/l60Hf.png"
  },
  status: {
    type: Boolean,
    default: false
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'Role'
  },
  loginCount: {
    type: Number,
    default: 0,
    min: [0, 'loginCount cannot be negative']
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
