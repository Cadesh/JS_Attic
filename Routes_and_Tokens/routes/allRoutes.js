//---------------------------------------------------------------
// ALL ROUTES REDIRECTS ROUTES TO SPECIFIC FILES
//---------------------------------------------------------------


//const { User, generateToken } = require("../models/user.model");
const express = require("express");
const allRouter = express.Router();    

//---------------------------------------------------------------
// USER ROUTES
//---------------------------------------------------------------
//init - If no token passed in, create one and return it to use as a unique identifier for this user for the remainder of the session. If token exists already, just return it again.
const initiateUser = require("../middleware/user.midware").initiateUser;
allRouter.route('/init') // initial endpoint for arriving users
  .post(initiateUser)
  
// allRouter.route('/userPrefs') 
//   .post(setUserPreferences) // Pass user prefs (preferred tone and topics) to onboard users. Just return an OK status or error.
//   .get(getUserPreferences); // Return the previously submitted user prefs (tone and topics

// allRouter.route('/userHistory') // Return an array of of all videos previously suggested/viewed/rated by this user, along with the rating given if any.
//   .get(getUserHistory); // @param user token
//---------------------------------------------------------------

//---------------------------------------------------------------
// VIDEO ROUTES
//---------------------------------------------------------------
// allRouter.route('/videos') // Return an array of videos suggested for this user, paginated perPage - integer, number of videos per page
//   .get(getVideos); //page-integer for page number. keywords-(optional) string of search keywords separated by spaces. token-user token.

// allRouter.route('/rateVideo') // Assign a rating for a specific video by this user. Just return an OK status or error
//   .post(setVideoRate); // videoID - a video contentId as returned from /videos call. rating-integer or string (TBD) that indicates thumbs up or down. token-user token.
//---------------------------------------------------------------

const testPost = require("../middleware/user.midware").testPost;
allRouter.route('/test') // initial endpoint for arriving users
  .post(testPost)


// function testPost2 (req, res) {
//   res.json('test Post');
// };


//---------------------------------------------------------------
// USER ARRIVAL
// 
//---------------------------------------------------------------
// async function initiateUser2 (req, res){
//   console.log ('Enter API')
//   //find an existing user
//   let user = await User.findOne({ token: req.body.token }); //search for a user iwth the token
//   if (user) {
//     return res.status(400).send("User already registered.");
//   }
//   else {
//     // create a new user to save
//     lToken = generateToken();
//     user = new User({ token: lToken });
//     console.log ('Saving User')
//     //user.hash = await bcrypt.hash(user.token, 10); //actually 
//     await user.save();
//     console.log ('Saved User')

//     res.header("x-auth-token", user.token).send({
//       token: lToken
//     });
//   }
// };
// //---------------------------------------------------------------

module.exports = allRouter;