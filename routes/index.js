var express = require('express');
var router = express.Router();

const messagesRouter = require('./messages');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// thêm dòng này
router.use('/messages', messagesRouter);

module.exports = router;