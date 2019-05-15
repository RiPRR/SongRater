module.exports.baseline = baselineGen
//ONE AT THE END TO PREVENT ERRORS WHEN ALL 0
const correlation = require('correlation-rank');
const request = require("request")
const mongoose = require('mongoose')
const db = require('../db')
const User = mongoose.model('User')
const Song = mongoose.model('Song')
const Rating = mongoose.model('Rating')
//let songName = process.argv[2]
//let targetUser = process.argv[3]
//baselineGen(songName,targetUser)

function correlator(songName,targetUser,base){
	request("http://localhost:3000/getRatings/"+songName+"/"+targetUser,{json:true},(err,res,body)=>{
		if (err) { return console.log(err); }
			let baseline = base
			let target = body[1]
			let bList = packager(baseline)
			let tList = packager(target)
			for(let i=0;i<bList.length;i++){
				//add the one for no errors using correlator
				bList[i].push(1)
				tList[i].push(1)
			}
			let anger = Math.floor(output(0,bList,tList))
			let joy= Math.floor(output(1,bList,tList))
			let disgust = Math.floor(output(2,bList,tList))
			let sadness = Math.floor(output(3,bList,tList))
			let fear = Math.floor(output(4,bList,tList))
			let suprise = Math.floor(output(5,bList,tList))
			console.log("TOTAL")
			const total = (anger+joy+disgust+suprise+sadness+fear)/6
			const roundedTotal = (Math.floor(total))
			console.log(roundedTotal)
			let data = {total:roundedTotal,
						 anger:anger,
						 joy:joy,
						 disgust:disgust,
						 sadness:sadness,
						 fear:fear,
						 suprise:suprise
						}
			data = JSON.stringify(data)
			//console.log(JSON.parse(data))
			Rating.findOneAndUpdate({"user.username":targetUser,"song.title":songName},{$set:{correlation:data}},{new:true},function(err,result,count){
				console.log(result)
			})
			return data
	})
}

function packager(ratings){
		let tAnger= []
		let tJoy = []
		let tDisgust= []
		let tSadness= []
		let tFear= []
		let tSuprise= []
	
		for(let i=0;i<ratings.length;i++){
			tAnger.push(ratings[i]["anger"])
			tJoy.push(ratings[i]["joy"])
			tDisgust.push(ratings[i]["disgust"])
			tSadness.push(ratings[i]["sadness"])
			tFear.push(ratings[i]["fear"])
			tSuprise.push(ratings[i]["surprise"])
		}
		
	
		return [tAnger,tJoy,tDisgust,tSadness,tFear,tSuprise]
}

function output(num,bList,tList){
		let emotion
		if(num===0){emotion="anger"}
		if(num===1){emotion="joy"}
		if(num===2){emotion="disgust"}
		if(num===3){emotion="sadness"}
		if(num===4){emotion="fear"}
		if(num===5){emotion="surprise"}
		console.log(emotion.toUpperCase())
		const score = Math.floor(correlation.rank(bList[num],tList[num])*100)
		console.log(score)
		console.log()
		console.log("BASELINE")
		console.log(bList[num])
		console.log()
		console.log("USER")
		console.log(tList[num])
		console.log()
		console.log("------------------------------------------------------------------------")
		console.log()
		return score
}

function baselineGen(songName,targetUser){
		request("http://localhost:3000/getRatings/"+songName+"/"+targetUser+"/test",{json:true},(err,res,body)=>{
				if (err) { return console.log(err); }
				//console.log(songName,targetUser)
				let bigPackage = []
				for(let i=0;i<body.length;i++){
					let target = body[i]["ratings"]
					let package = packager(target)
					bigPackage.push(package)
				}
				let baseline = []
				let anger = []
				let joy = []
				let disgust = []
				let sadness = []
				let fear = []
				let surprise = []
				let newPackage = []
				newPackage.push(anger,joy,disgust,sadness,fear,surprise)
				for(let i=0;i<6;i++){
					//for each score
					for(let j=0;j<bigPackage[0][0].length;j++){
						total = 0
						//for each rating
						for(let k=0;k<bigPackage.length;k++){
							//selects rating 1 score 1 from emotion 1
							let score = bigPackage[k][i][j]
							total+=score
							let rating = k+1
							let emotion
							if(i===0){emotion="anger"}
							if(i===1){emotion="joy"}
							if(i===2){emotion="disgust"}
							if(i===3){emotion="sadness"}
							if(i===4){emotion="fear"}
							if(i===5){emotion="surprise"}
							//console.log("RATING: "+rating+" EMOTION: "+emotion+" SCORE: "+score)
						}
						let average = total/bigPackage.length
						newPackage[i].push(Math.round(average*10)/10)
					}
				}
				//console.log(newPackage.length)
				for(let i=0;i<newPackage[0].length;i++){
					let line = {}
					for(let j=0;j<newPackage.length;j++){
						if(j===0){line["anger"] = newPackage[j][i]}
						if(j===1){line["joy"] = newPackage[j][i]}
						if(j===2){line["disgust"] = newPackage[j][i]}
						if(j===3){line["sadness"] = newPackage[j][i]}
						if(j===4){line["fear"] = newPackage[j][i]}
						if(j===5){line["surprise"] = newPackage[j][i]}
					}
					baseline.push(line)
				}
				//console.log(baseline)
				let toReturn = correlator(songName,targetUser,baseline)
				return toReturn
		})
}








