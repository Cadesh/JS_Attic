// DEPENDENCIES
const jwt     = require('jsonwebtoken');              // Dependency for token generation and validation
// MONGOOSE MODELS
const User    = require("../models/user.model").User; // User mongoose data model
// CONFIG FILE
const config  = require('../config');                 // app configurations

//---------------------------------------------------------------
function testPost (req, res) {
  console.log('testPost works');
  res.json('test Post');
};
//---------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * Initiates a new `user`.
 * Checks if the user exists and returns token, if new user generates new token
 * @return {token} 
 *///---------------------------------------------------------------------------
async function initiateUser (req, res){

  let lToken = req.body.token;
  // 1. Validate token 
  validToken = validateToken (lToken);
  if (validToken) { // 2. If token valid, search for user by token
    let user = await User.findOne({ token: lToken }); //search for a user iwth the token
    if (user) {     // 2.1 User exists
      console.log ('User returned: ' + lToken);
    }
    else {          // 2.2 Did not find user, erases token, needs new token
      lToken = '';  
      console.log ('Could not find user');
    }
  }
  else {            // 2.3 Token is not valid
    lToken = '';
    console.log ('User with invalid token.');
  }
  
  // 3. If no token or no valid token, create a new user and saves
  if (lToken == '') {
      lToken = generateToken();
      user = new User({ token: lToken });
      await user.save();
      console.log ('New user registered.');
  }

  // 4. Send response to user with token
  res.header("x-auth-token", lToken).send({
    token: lToken
  });
};
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * Generate a `new token` (for new users) with the jwt module
 * @return {String} token 
 *///---------------------------------------------------------------------------
 function generateToken () { 
	const username = 'user';
	const token = jwt.sign({username}, config.sessionSecret, {subject: 'Vubble Token'}); // generate token
	return token;
};
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * Checks if the token is a `valid token` with jwt module and the sessionSecret from config.js
 * @param {String} pToken
 * @return {boolean} true - token valid; false - invalid token 
 *///---------------------------------------------------------------------------
function validateToken (pToken) {
    //Using jwt package and sessionSecret string from config.js to validate the token.
    isValid = false;
    jwt.verify(pToken, config.sessionSecret, (err) => {   
      if (err) {   // Not a valid token
        isValid = false;
      } else {     // Valid token
        isValid = true;
      }
    });
    return isValid;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
module.exports.initiateUser = initiateUser;
module.exports.testPost = testPost;
//------------------------------------------------------------------------------

