var express = require('express');
var router = express.Router(); // instance of express

/* GET home page. */

// estrutura do routing: router.METHOD(PATH, HANDLER)
//router is an instance of express.
//METHOD is an HTTP request method, in lowercase.
//PATH is a path on the server.
//HANDLER is the function executed when the route is matched.

// get is used to request data 
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' }); //this render index.pug with the variable title

});

module.exports = router;
