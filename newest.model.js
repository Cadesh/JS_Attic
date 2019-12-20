/**
 * @author Andre Rosa
 * @file new.model.js
 * @description Definition and Functions to manage `newest` collection for MongoDB
 * Newest collection holds info about new videos before they are checked for user suggestions.
 */
//------------------------------------------------------------------------------
const mongoose = require('mongoose');
const pino = require('pino');

const logger = pino({ prettyPrint: true });
//-------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * @description heold the information about any new video added to the const DB
 * Later these new videos are checked by DBotSuGen to be added to user suggestions
 * and are deleted from this collection.
 *///----------------------------------------------------------------------------
const NewestSchema = new mongoose.Schema({
  contentId: { type: String, unique: true }, // id defined in Vubble original DB
  toneScore: { type: Number, required: true }, // integer value -2, -1, 0, 1 or 2
  lang: { type: String, required: true }, // language used in the video
  categories: [{ type: String, required: true }], // curated tags from Vubble
});
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * @description Add `new` to collection.
 * @param {Object} newVideo - JSON video object as defined in documentation
 * @return {Boolean} True if the video was added, false if video is not added
 *///----------------------------------------------------------------------------
NewestSchema.statics.addNew = async function (newVideo) {
  let isAdded = false;
  try {
    // check some fields for well-formness
    if (((Object.prototype.hasOwnProperty.call(newVideo.video, 'contentId'))
        && (Object.prototype.hasOwnProperty.call(newVideo.video, 'lang'))
        && (Object.prototype.hasOwnProperty.call(newVideo.video, 'toneScore')))) {
    // check if the video is already in DB
      const vid = await this.findOne({ key: newVideo.video.contentId }).lean().exec();
      if (!vid) { // video doesn't exist, save the new video
        const vd = {};
        vd.contentId = newVideo.video.contentId;
        vd.lang = newVideo.video.lang;
        vd.toneScore = newVideo.video.toneScore;
        vd.categories = newVideo.video.categories;
        this.create(vd); // save the new video to the db
        isAdded = true;
      } else {
        logger.error(`New already exists, new contentId: ${newVideo.video.contentId}`);
      }
    } else {
      logger.error('new.model.js/addNew video object not well-formed (missing fields).');
      isAdded = false;
    }
  } catch (e) {
    logger.error('new.model.js/addNew cannot add video to DB.');
    throw new Error('new.model.js/addNew cannot add video to DB.');
  }
  return isAdded;
};
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * @description Delete `video` from collection.
 * @param {String} id - video Key as defined in model the same as contentId from Vubble
 *///----------------------------------------------------------------------------
NewestSchema.statics.deleteNew = async function (id) {
  try {
    await this.deleteOne({ contentId: id });
    logger.info(`video.model.js/deleteNew deleted from Newest, contentId: ${id}`);
  } catch {
    logger.error(`video.model.js/deleteNew cannot delete video, contentId: ${id}`);
    throw new Error(`video.model.js/deleteNew cannot delete video, contentd: ${id}`);
  }
};
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * @description Get All `Newest` videos
 * @return {Array} List of `Newest` videos.
 *///----------------------------------------------------------------------------
NewestSchema.statics.getAllNewestVids = async function () {
  try {
    const vids = await this.find({}).lean().exec();
    return vids;
  } catch {
    logger.error('video.model.js/getVideoData cannot get video data.');
    throw new Error('video.model.js/getVideoData, maybe video does not exist? ');
  }
};
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * @description Delete ALL `Newest` videos from collection
 *///---------------------------------------------------------------------------
NewestSchema.statics.deleteAllNewest = async function () {
  let done = false;
  try {
    this.deleteMany({});
    done = true;
  } catch (err) {
    logger.error('video.model.js/deleteAllVideos cannot delete all videos.');
    done = false;
  }
  return done;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// EXPORTS USER MODEL AND FUNCTIONS
//-------------------------------------------------------------------------------
const Newest = mongoose.model('Newest', NewestSchema);
module.exports.Newest = Newest;
//-------------------------------------------------------------------------------
