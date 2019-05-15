const mongoose = require('mongoose')
const db = require('../db')
const User = mongoose.model('User')
const bCrypt = require('bcrypt-nodejs')
const LocalStrategy   = require('passport-local').Strategy;
const sanitize = require("mongo-sanitize")

module.exports = function(passport){
	passport.use('register', new LocalStrategy({passReqToCallback:true},
	function(req,username,password,done){
		createUser = function(){
			//make sure user entries are not dangerous by sanitizing!
			age = req.body["ageInput"]
			gender = req.body["genderInput"]
			password = sanitize(password)
			username = sanitize(username).trim()
			//look to see if the username already exists
			User.findOne({"username":username},function(err,user){
				if(err){
					console.log(err)
					return done(err)
				}
				//if username exists already
				if(user){
					console.log("User: "+username+" already exists, please try again")
					return done(null,false)
				}
				//if this is a new user and username isn't taken
				else{
					//encrypt their password
					const hashedpassword = hash(password)
					//if all went well, create a new user 
					const newUser = new User({username:username,password:hashedpassword,age:age,gender:gender});
					newUser.save(function(err){
						if(err){
							console.log("Error saving new user")
							console.log(err)
							throw err
						}
						else{
							console.log("REGISTERED NEW USER "+username)
							return done(null,newUser)
						}
					})					
				}
			})
		}
		//delay execution to maintain consistancy
		process.nextTick(createUser)
	})
	)

	//Password hashing function using node bcrypt, takes passsword and puts it through 
	//10(suggested) rounds of encryption 
	const hash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
	}
}
