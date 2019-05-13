
// MONGOOSE TUTORIAL CODE
// CREATE SCHEMA, MODEL, SAVE and READ FROM LOCAL DB
// Install Mongoose with npm install mongoose
// Modified from https://mongoosejs.com/docs/index.html

// 1. INCLUDE MONGOOSE AND CONNECT TO THE DATABASE
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

//2. TRY TO CONNECT TO DATABASE
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log ("Connected to DB");
});

//3. DEFINE SCHEMA FOR TANK OBJECT
var tankSchema = new mongoose.Schema({
    name: {type: String},
    speed: {type: Number},
    image: {type: String}
  });

//4. DEFINE ALL TANK METHODS
tankSchema.methods.move = function () {
    var lSpeed = this.speed;
    var lName = this.name;
    var message = this.name ? this.name + " moves at " + this.speed + " km/h" : "";
    console.log(message);
}
tankSchema.methods.shoot = function () {
    var lName = this.name;
    var message = this.name ? this.name + " shoots!" : "";
    console.log(message);
}

//5. COMPILE SCHEMA INTO A DB MODEL
var Tank = mongoose.model('Tank', tankSchema);

//6. CREATES OBJECTS FROM THE MODEL (WILL CREATE NEW ONES EVERYTIME YOU RUN THE CODE)
var Tiger = new Tank({ name: 'Tiger', speed: '12' });
var Panther = new Tank({ name: 'Panther', speed: '16' });

//--------------------------- comment the lines bellow after the 1st run or new objects will be created
//7. MAKES OBJECT EXECUTE ACTIONS
Panther.move(); 
Tiger.shoot();

//8. SAVE OBJECTS IN DB
Panther.save(function (err, Panther) {
    if (err)  {
    return console.error(err);
    }
});
Tiger.save(function (err, Tiger) {
    if (err)  {
    return console.error(err);
    }
});
//----------------------------- comment up to here


//9. GET ALL TANK OBJETCS
Tank.find(function (err, tanks) {
    if (err)  {
        return console.error(err);
    }
    console.log(tanks);
})

//10. FIND OBJECT WITH SPECIFIC NAME
Tank.find({ name: "Tiger" }, function(err, tanks) {
    console.log (tanks);
});