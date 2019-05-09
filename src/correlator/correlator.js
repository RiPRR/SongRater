
//ONE AT THE END TO PREVENT ERRORS WHEN ALL 0
const correlation = require('correlation-rank');
const request = require("request")

let songName = "isolation"
let targetUser = "ryan"
request("http://localhost:3000/getRatings/"+songName+"/"+targetUser,{json:true},(err,res,body)=>{
	if (err) { return console.log(err); }
  	let baseline = body[0]
  	let target = body[1]
  	let bList = packager(baseline)
  	let tList = packager(target)
  	for(let i=0;i<bList.length;i++){
  		bList[i].push(1)
  		tList[i].push(1)
  	}
  	output(0,bList,tList)
  	output(1,bList,tList)
  	output(2,bList,tList)
  	output(3,bList,tList)
  	output(4,bList,tList)
  	output(5,bList,tList)
})




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
	const score =correlation.rank(bList[num],tList[num])*100
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
}







