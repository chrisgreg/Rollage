var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '/r/ollage', description: 'The Reddit Collage Generator', author: 'Chris Gregori' });
});

module.exports = router;
