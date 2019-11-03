//---------------------------------------------------------------
// NPM PACKAGES
//---------------------------------------------------------------
const feed         = require('rss-to-json'); 
const fs           = require('fs');
const readline     = require('readline'); 
const async        = require("async");
//---------------------------------------------------------------
//---------------------------------------------------------------
async.waterfall([
    loadURLs,
    getFeeds,
], function(err, result) {
    console.log(result);
});
//---------------------------------------------------------------
//---------------------------------------------------------------
// Load the file with URL description as seen in 
//---------------------------------------------------------------
function loadURLs(callback) {
    var URLFeeds = [];
    fs.readFileSync("Feeds_TestList.txt").toString().split("\n").forEach(function(ln, index, arr) {
    let line = ln;
    if (line.substring(0, 5) === '[http') {
        line = line.substring(1, line.length - 1).slice(0, -1); // remove the [ ] from the URL
        //console.log(index + " " + line);
        URLFeeds.push(line);
    }
    });
    callback(null, URLFeeds);
} 
//---------------------------------------------------------------
// LOOP THE FEED URLs TO GET THE ARTICLES
//---------------------------------------------------------------
function getFeeds(URLFeeds, callback) {
    
    // Loop url array to get the feeds
    for (let i = 0; i < URLFeeds.length; i++) {
        // 2. Get the new feeds and save to Redis queue
        feed.load(URLFeeds[i], function(err, rss){
            console.log(URLFeeds[i]);
        });
    }
    callback (null, 'done');
}
//---------------------------------------------------------------
