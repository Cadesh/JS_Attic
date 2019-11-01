//---------------------------------------------------------------
// NPM PACKAGES
const express      = require('express');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
//const session    = require('express-session');   NOT YET
//const request    = require('request')            NOT YET
//---------------------------------------------------------------

//---------------------------------------------------------------
// SERVER START POINT
//---------------------------------------------------------------
console.log('Starting App');
let app = express(); // Export app for other routes to use
const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//---------------------------------------------------------------

//---------------------------------------------------------------
// CONNECT TO MONGODB DATABASE
//---------------------------------------------------------------
console.log('Create Database connection');
const dbName = 'DBoxDB';                                   // name of the database
const mongoDB = "mongodb://localhost:27017/" + dbName;     //always connec to local Mongo Database
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }); 
//---------------------------------------------------------------

//---------------------------------------------------------------
// ROUTES AND HANDLERS
//---------------------------------------------------------------
console.log('Setup Routes');
const allRoutes = require("./routes/allRoutes");
app.use('/api', allRoutes);  
//---------------------------------------------------------------

//---------------------------------------------------------------
// START LISTENING
//---------------------------------------------------------------
app.listen(port, () => console.log(`Server is listening on port: ${port}`));
//---------------------------------------------------------------


