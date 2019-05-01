const mongoose = require('mongoose')
const db = require('../db')
const User = mongoose.model('User')
const register = require("./register")
const login = require("./login")
module.exports = function(passport){
	//serializeUser determines which data of the 
	//user object should be stored in the session(id!).
	passport.serializeUser(function(user,done){
		done(null,user._id)
	})
	//deserializeUser allows the rest of the user data to be found
	//ie: prefrences and creates the whole req.user Object!
	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
			//console.log("----------------------------------")
			done(err,user)
		})
	})
	//Strategies 
	login(passport)
	register(passport)
}