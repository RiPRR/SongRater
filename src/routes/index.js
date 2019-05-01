const express =require("express")
const router = express.Router()
const mongoose = require('mongoose')
const db = require('../db')
const User = mongoose.model('User')
const Rating = mongoose.model('Rating')

const isAuthenticated = function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/failure")
}
module.exports = function(passport){

	router.get("/",(req,res)=>{
		res.send("HELLO WORLD")
	})

	router.get("/:id",isAuthenticated,(req,res)=>{
		if(req.user.username === req.params.id){
			username = req.user.username
			Ride.find({username:username}, function(err, results, count) {
				res.render("user.hbs",{"username":username,"results":results})
			}).limit(20);
		}
		else{
			res.redirect("/")
		}
	})

	router.post("/register",passport.authenticate("register",{failureRedirect:"/failure",}),
		(req,res)=>{
			//on success print this on failure redirect to /failure
			res.redirect("/"+req.user.username)
	})

	//login route employing Passport login Strategy (login.js)
	router.post("/login",passport.authenticate("login",{failureRedirect:"/failure",}),
		(req,res)=>{
			//on success print this on failure redirect to /failure
			res.redirect("/"+req.user.username)
	})

	return router
}