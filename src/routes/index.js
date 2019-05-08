const express =require("express")
const router = express.Router()
const mongoose = require('mongoose')
const db = require('../db')
const User = mongoose.model('User')
const Song = mongoose.model('Song')
const Rating = mongoose.model('Rating')

const isAuthenticated = function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/")
}
module.exports = function(passport){

	router.get("/",(req,res)=>{
		if(req.user){
			Song.find({}, function(err, results, count) {
				let songResults = results
				User.find({username:req.user.username},function(err,results,count){
					done = false
					let rand = 0
					while(!done){
						console.log(rand)
						let selection = songResults[rand]
						let ratedSongs = results[0].songs
						if(!ratedSongs.includes(selection.title)){
							const lyrics = selection.lyrics
							const title = (selection.title).replace(/_/g," ").toUpperCase()
							const artist = (selection.artist).replace(/_/g," ").toUpperCase()
							res.render("main.hbs",{"username":req.user.username,
							"login":"flex",
							"register":"none",
							"results":lyrics,
							"title":title,
							"artist":artist
							})	
							done = true
						}
						else{
							rand+=1
						}
					}
				})
			})
		}
		else{
			res.render("main.hbs",{"login":"none"})
		}
	})

	
	router.get("/getSong/:Song",isAuthenticated,(req,res)=>{
		let songTitle = req.params.Song
		Song.find({title:songTitle}, function(err, results, count) {
				res.send(results[0])
		})
	})

	router.get("/survey",isAuthenticated,(req,res)=>{
		res.render("rating.hbs",{username:req.user.username})
	})

	router.post("/newRating",isAuthenticated,(req,res)=>{
		const username = req.user.username
		const songName = req.body[0]["name"]
		req.body.shift()
		const ratings = req.body
		Song.find({title:songName},function(err,result,count){
			console.log(result)
			let songObject = result
			User.findOneAndUpdate({username:username},{$push:{songs:songName}},{new:true},function(err,result,count){
				const ratingToAdd = new Rating({user:result,song:songObject,ratings:ratings})
				ratingToAdd.save((err,saved,count)=>{
					console.log(saved)
				})

			})
		})
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

	router.get("/failure",(req,res)=>{
		res.redirect("/")
	})

	

	return router
}