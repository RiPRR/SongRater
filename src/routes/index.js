const express =require("express")
const router = express.Router()
const mongoose = require('mongoose')
const db = require('../db')
const User = mongoose.model('User')
const Song = mongoose.model('Song')

const isAuthenticated = function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/failure")
}
module.exports = function(passport){

	router.get("/",(req,res)=>{
		if(req.user){
			Song.find({title:"brand_new_city"}, function(err, results, count) {
				const lyrics = results[0].lyrics
				const title = ((results[0].title).replace(/_/g," ")).toUpperCase()
				const artist = ((results[0].artist).replace(/_/g," ")).toUpperCase()
				res.render("main.hbs",{"username":req.user.username,
				"login":"flex",
				"register":"none",
				"results":lyrics,
				"title":title,
				"artist":artist
				})
			})
		}
		else{
			res.render("main.hbs",{"login":"none"})
		}
	})

	
	router.get("/songData",(req,res)=>{
		Song.find({title:"brand_new_city"}, function(err, results, count) {
				res.send(results[0])
		})
	})

	router.get("/survey",isAuthenticated,(req,res)=>{
		res.render("rating.hbs",{username:req.user.username})
	})

	router.post("/register",passport.authenticate("register",{failureRedirect:"/failure",}),
		(req,res)=>{
			//on success print this on failure redirect to /failure
			res.redirect("/")
	})

	//login route employing Passport login Strategy (login.js)
	router.post("/login",passport.authenticate("login",{failureRedirect:"/failure",}),
		(req,res)=>{
			//on success print this on failure redirect to /failure
			res.redirect("/")
	})

	return router
}