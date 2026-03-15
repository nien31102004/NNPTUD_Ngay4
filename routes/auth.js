var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, validatedResult } = require('../utils/validator')
let {CheckLogin} = require('../utils/authHandler')

router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let token = await userController.QueryLogin(username, password);
    if (!token) {
        return res.status(401).send({ message: "thong tin dang nhap khong dung" });
    }
    res.send({ token: token, tokenType: 'Bearer', expiresIn: 86400 });
});

router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b6231b3de61addb401ea26'
    );
    res.send(newUser);
});

router.get('/me', CheckLogin, function (req, res, next) {
    let user = req.user.toObject ? req.user.toObject() : req.user;
    delete user.password;
    res.send(user);
});

router.post('/change-password', CheckLogin, async function (req, res, next) {
    try {
        let { oldPassword, newPassword } = req.body;
        await userController.ChangePassword(req.user._id, oldPassword, newPassword);
        res.send({ message : 'Doi mat khau thanh cong' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;