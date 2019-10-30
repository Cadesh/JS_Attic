
//FOR POSTMAN POST REQUEST LOGIN
//HEADERS
// Content-Type: application/json
//BODY
// {
//   "password": "password",
//   "username": "admin"
// }
//WILL RETURN
// {
//   "success": true,
//   "message": "Authentication successful!",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTcyNDQ4MDU3LCJleHAiOjE1NzI1MzQ0NTd9.-jOELs1kzV5I1Cuwn6T8spRtBKN3vu5HQHZMuFXJMJU"
// }


const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

let config = require('./config');
let middleware = require('./middleware/auth');

class HandlerGenerator {
  login (req, res) {
    console.log('get login');
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
        console.log('get in');
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.sessionSecret,
          { expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.sendStatus(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.sendStatus(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
}

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
  // Routes & Handlers
  app.post('/login', handlers.login);
  app.get('/', middleware.checkToken, handlers.index);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();


