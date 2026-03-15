const userModel = require('../schemas/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('keys/private.key', 'utf8');
const publicKey = fs.readFileSync('keys/public.key', 'utf8');

function validateStrongPassword(password) {
  if (!password || typeof password !== 'string') return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

module.exports = {
  CreateAnUser: async function (username, password, email, role, fullName, avatarUrl, status, loginCount) {
    let newItem = new userModel({
      username: username,
      password: password,
      email: email,
      fullName: fullName,
      avatarUrl: avatarUrl,
      status: status,
      role: role,
      loginCount: loginCount
    });
    await newItem.save();
    return newItem;
  },
  GetAllUser: async function () {
    return await userModel.find({ isDeleted: false });
  },
  GetUserById: async function (id) {
    try {
      return await userModel.findOne({ isDeleted: false, _id: id });
    } catch (error) {
      return false;
    }
  },
  QueryLogin: async function (username, password) {
    if (!username || !password) {
      return false;
    }
    let user = await userModel.findOne({ username: username, isDeleted: false });
    if (!user) return false;

    let match = bcrypt.compareSync(password, user.password);
    if (!match) return false;

    let token = jwt.sign({ id: user.id }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1d'
    });
    return token;
  },
  ChangePassword: async function (userId, oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      throw new Error('oldPassword và newPassword là b?t bu?c');
    }
    if (!validateStrongPassword(newPassword)) {
      throw new Error('newPassword ph?i ít nh?t 8 ký t?, có ch? hoa, ch? thu?ng, s? và ký t? d?c bi?t');
    }
    let user = await userModel.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      throw new Error('Ngu?i dùng không t?n t?i');
    }
    let isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('oldPassword không dúng');
    }
    user.password = newPassword;
    await user.save();
    return true;
  },
  getPublicKey: function () {
    return publicKey;
  }
};
