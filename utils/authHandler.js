const userController = require('../controllers/users');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicKey = fs.readFileSync('keys/public.key', 'utf8');

module.exports = {
  CheckLogin: async function (req, res, next) {
    try {
      let token = req.headers.authorization;
      if (!token || !token.startsWith('Bearer ')) {
        return res.status(403).send({ message: 'ban chua dang nhap' });
      }
      token = token.split(' ')[1];
      let result = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      let getUser = await userController.GetUserById(result.id);
      if (!getUser) {
        return res.status(403).send({ message: 'ban chua dang nhap' });
      }
      req.user = getUser;
      next();
    } catch (error) {
      return res.status(403).send({ message: 'ban chua dang nhap' });
    }
  }
};
