//---------------------------------------------------------------------------
// MODEL - USER - holds user information
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// NPM PACKAGES
const mongoose = require('mongoose');            
const bcrypt = require('bcrypt');               // for hashing the token
//var ObjectId = require('mongoose').Types.ObjectId;

// MODELS FILES
//var Attribute = require('./attribute.js');
//var Video = require('./video.js');
//---------------------------------------------------------------------------


//---------------------------------------------------------------------------
// DEFINE USER SCHEMA
//---------------------------------------------------------------------------
var UserSchema = new mongoose.Schema({

	name: {type: String},
	token: {type: String, required: true, unique: true}, //token, used now in clear for testing 
	hash: {type: String},                                //hashed token
	createdDate: {type: Date, default: Date.now}         //date the user was created
	
	//-------------------------------------------------------------
	// videoHistory: [{
	// 	_video: {type: mongoose.SchemaTypes.ObjectId, ref: 'Video'},
	// 	lastInteractionDate: {type: Date},
	// 	watchedScore: {type: Number}, // score 0 means the video was never presented to the user, score 1 means the video was presented but not watched, score 2 means the video was presented and watched
	// 	rating: {type: Number} // 0 means the video was not rated
	// }]
	//-------------------------------------------------------------
	// video preference tags obtained from onboarding the user
	// onboardedAttributes: [{
	// 	_attribute: {type: mongoose.SchemaTypes.ObjectId, ref: 'Attribute'},
	// 	score: {type: Number} // this score goes from positive to negative
	// }],
	//-------------------------------------------------------------

});
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// BEFORE SAVING A NEW USER IN BD GENERATES A HASH
//---------------------------------------------------------------------------
UserSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash( user.token, 10, function(err, lHash) {     // hash the user token
		user.hash = lHash;
		next();
	});
});
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// EXPORTS USER MODEL AND FUNCTIONS
//---------------------------------------------------------------------------
const User = mongoose.model('User', UserSchema);
module.exports.User = User;
//---------------------------------------------------------------------------