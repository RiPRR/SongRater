const mongoose = require('mongoose')
const db = require('../db')
const User = mongoose.model('User')
const bCrypt = require('bcrypt-nodejs')
const LocalStrategy   = require('passport-local').Strategy;
const sanitize = require("mongo-sanitize")

module.exports = function(passport){
	passport.use("login", new LocalStrategy({passReqToCallback: true},
		function(req,username,password,done){
			//make sure no evil is being inserted by sanitizing 
			password = sanitize(password)
			username = sanitize(username)
			//look for user in DB
			User.findOne({"username":username},function(err,user){
				if(err){
					console.log("Sorry an error occured")
					return done(err)
				}
				//if no user exists
				if(!user){
					console.log(username+" Is not a valid username,please try again")
					return done(null,false)
				}
				//if user exists but the password is wrong
				if(!isValidPassword(user,password)){
					console.log("Invalid password for User: "+username)
					return done(null,false)
				}
				//All good! login success
				console.log("LOGGED IN AS: "+username)
				return done(null,user)
			})
		}
	))
	//make sure the password is correct
	const isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password)
	}
}