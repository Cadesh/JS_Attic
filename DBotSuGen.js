/**
 * @author Andre Rosa
 * @file DBotSuGen.js
 * @description This App runs in parallel with DBotSrv.
 * The objective is to keep up-to-date video suggestions for the users.
 * The App checks new videos from the table newvideos and updates user suggestions.
 */

//------------------------------------------------------------------------------
// NPM MODULES
const mongoose = require('mongoose');
const cron = require('node-cron');
const pino = require('pino');

const logger = pino({ prettyPrint: true });
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// APP CONFIGURATION FILE
const config = require('./config'); // app configurations
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// CONNECT TO MONGODB DATABASE
//------------------------------------------------------------------------------
logger.info(`Create Database connection to ${config.prodDB}`);
const dbName = config.prodDB; // name of the database
const mngDB = `mongodb://localhost:27017/${dbName}`; // always connec to local Mongo Database
mongoose.connect(mngDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// MONGOOSE MODEL
const { Newest } = require('./models/newest.model'); // User mongoose data model
const { User } = require('./models/user.model'); // User mongoose data model
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
* @description Gets all `Newest` videos
* @return {Array} Objects `Newest`.
*///----------------------------------------------------------------------------
async function getAllNewest() {
  try {
    const vid = await Newest.getAllNewestVids();
    // TODO: delete the videos from Newest
    return vid;
  } catch (err) {
    logger.error('DBotSuGen.js/getAllNewest cannot get newest');
    throw new Error(`DBotSuGen.js/getAllNewest cannot get newest ${err}`);
  }
}
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
* @description Checks the newest added videos and add the to user suggestions.
* @return {Array} Objects `Video` from video.
*///----------------------------------------------------------------------------
async function getAllUsers() {
  try {
    const usr = await User.find().lean().exec();
    return usr;
  } catch (err) {
    logger.error('DBotSuGen.js/getAllUsers cannot get users');
    throw new Error(`DBotSuGen.js/getAllUsers cannot get users ${err}`);
  }
}
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
* @description Checks users preferences to suggest new videos
* change code for https://masteringjs.io/tutorials/mongoose/find-all in case of too many users
*///----------------------------------------------------------------------------
async function makeSuggestions(allUsers, allNewest) {
  try {
    for (let i = 0; i < allUsers.lenght; i += 1) {
      for (let j = 0; j < allNewest.lenght; j += 1) {
        console.log('suggested'); // TODO: Add the last code. 
      }
    }
  } catch (err) {
    logger.error('DBotSuGen.js/makeSuggestions cannot make suggestions');
    throw new Error(`DBotSuGen.js/makeSuggestions cannot make suggestions ${err}`);
  }
}
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * @description Checks the newest added videos and add the to user suggestions.
 * according to user preferences.
 * For Promise.all check:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
*///-----------------------------------------------------------------------------
async function makeNewSuggestions() {
  try {
    // 1. Get all users
    const allUsers = getAllUsers();
    // 2. Get all new videos from newest collection
    const allNewest = getAllNewest();
    // 3. When both promises are resolved make suggestions
    //makeSuggestions(allUsers, allNewest);
    Promise.all([allUsers, allNewest]).then((values) =>{
      makeSuggestions(values[0], values[1]),
      logger.info(`DBotSuGen.js/makeVideoSuggestions new ${values[1].length} videos`)
    });
  } catch (err) {
    logger.error('DBotSuGen.js/makeVideoSuggestions failed');
    throw new Error(`DBotSuGen.js/makeVideoSuggestions failed ${err}`);
  }
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// for every hour '0 * * * *' https://crontab.guru/every-1-hour
cron.schedule('* * * * * *', () => {
  makeNewSuggestions();
});
//------------------------------------------------------------------------------
