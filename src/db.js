const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



//All the fields relevant to a ride (not all fields but the ones relevant to this app)
const ratingSchema = new mongoose.Schema({
	title:{type:String,required:true},
	artist:{type:String,required:true},
	user:{type:String,required:true},
	data:{type:Array,required:true},
});
const userSchema = new mongoose.Schema({
	username:{type:String,required:true},
	password:{type:String,required:true},
	songs:{type:Array,required:false}
})
mongoose.model("Rating",ratingSchema)
const Rating = mongoose.model("Rating")
mongoose.model("User",userSchema)
const User = mongoose.model("User")

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/songratings';
}

mongoose.connect(dbconf);