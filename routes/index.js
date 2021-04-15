var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/datos', function(req, res, next) {
  res.send('Estos son algunos datos');
});

module.exports = router;
