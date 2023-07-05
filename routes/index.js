var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '领取流量包' });
});

router.get('/sendSms', function(req, res, next) {
  console.log(req)
  console.log(res)
});

module.exports = router;
