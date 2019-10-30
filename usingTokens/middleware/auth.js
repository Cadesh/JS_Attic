

let jwt = require('jsonwebtoken');
//const config = require('./config.js');

// 1. Capture headers with names ‘x-access-token’ or ‘Authorization.’
let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
     // 2. If the header is in ‘Authorization: Bearer xxxx…’ format, strip unwanted prefix before token.
    token = token.slice(7, token.length);
  }

  if (token) {
    // 3. Using jwt package and secret string, validate the token.
    jwt.verify(token, config.sessionSecret, (err, decoded) => {
      // 4. If anything goes wrong, return an error immediately before passing control to next handler.
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

// Export the middleware function for other modules to use.
module.exports = {
  checkToken: checkToken
}

