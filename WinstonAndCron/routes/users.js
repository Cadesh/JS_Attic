var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// this route is called as localhost:3000/users/oi
router.get('/oi', function(req, res, next) {
  console.log('Called route oi')
  res.render('oi', { title: 'Oi', message: 'teste de pug!' })
});


module.exports = router;
