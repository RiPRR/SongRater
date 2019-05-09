let myStorage = window.localStorage
window.addEventListener('load', function() {
	const logSwitch = document.getElementById("regSwitch")
	const accessText =  document.getElementById("accessText")
	const access = document.getElementById("access")
	const surveyBttn = document.getElementById("surveyBttn")
	const lineDiv = document.getElementById("lineDiv")
	const begin = document.getElementById("beginSurvey")
	const nextBttn = document.getElementById("nextBttn")
	const finish = document.getElementById("submitBttn")
	const sName = document.getElementById("sName")
	if(sName){
		let fName = sName.textContent
		fName = fName.replace(" ","_").toLowerCase()
		myStorage.setItem("songName",fName)
	}
	if(logSwitch){
		logSwitch.addEventListener('click', function() {
	   		if(logSwitch.textContent === "(REGISTER?)"){
	   			logSwitch.textContent = "(LOGIN?)"
	   			accessText.textContent = "REGISTER"
	   			access.setAttribute("action","/register")
	   		}
	   		else{
	   			logSwitch.textContent = "(REGISTER?)"
	   			accessText.textContent = "LOGIN"
	   			access.setAttribute("action","/login")
	   		}
		})
	}
	if(lineDiv){
		let songName = myStorage.getItem("songName")
		console.log(songName)
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if(this.readyState==4 && this.status == 200){
				let data = (xhttp.responseText)
				myStorage.setItem("songData",data)
			}
		} 
		xhttp.open("GET","/getSong/"+songName,true)
		xhttp.send()
	}
	if(begin){
		begin.addEventListener("click",function(){
			processData()
			begin.style.display = "none"
			myStorage.setItem("ratings","[]")
		})
	}
	if(nextBttn){
		nextBttn.addEventListener("click",function(){
			let curLine = Number(myStorage.getItem("curLine"))
			let anger = Number(document.getElementById("angerRank").value)
			let joy = Number(document.getElementById("joyRank").value)
			let disgust = Number(document.getElementById("disgustRank").value)
			let sadness = Number(document.getElementById("sadnessRank").value)
			let fear = Number(document.getElementById("fearRank").value)
			let surprise = Number(document.getElementById("surpriseRank").value)
			let curRatings = myStorage.getItem("ratings")
			let parsedRatings = JSON.parse(curRatings)
			if(parsedRatings.length<=1){
				let name = myStorage.getItem("songName")
				parsedRatings.push({name})
			}
			parsedRatings.push({
				anger:anger,
				joy:joy,
				disgust:disgust,
				sadness:sadness,
				fear:fear,
				surprise:surprise,
			})
			parsedRatings = JSON.stringify(parsedRatings)
			myStorage.setItem("ratings",parsedRatings)
			curLine+=1
			myStorage.setItem("curLine",curLine)
			document.getElementById("angerRank").value = 0
			document.getElementById("joyRank").value = 0
			document.getElementById("disgustRank").value = 0
			document.getElementById("sadnessRank").value = 0
			document.getElementById("fearRank").value = 0
			document.getElementById("surpriseRank").value = 0
			renderLine(curLine)
		})
	}
	if(finish){
		finish.addEventListener("click",function(){
			upload()
		})
	}
})
function processData(){
	let data = JSON.parse(myStorage.getItem("songData"))
	let lyrics = data["lyrics"]
	let formattedLyrics = []
	for(let i=0;i<lyrics.length;i++){
		for(let j=0;j<lyrics[i].length;j++){
			let line = lyrics[i][j].replace(/,/g," ")
			line+=","
			formattedLyrics.push(line)
		}
	}
	formattedLyrics = formattedLyrics.filter(function(elem, index, self) {
    	return index === self.indexOf(elem);
	})
	myStorage.setItem("lyrics",formattedLyrics)
	myStorage.setItem("lines",formattedLyrics.length)
	myStorage.setItem("curLine",1)
	renderLine(1)
}
function renderLine(lineNum){
		let lineText = document.getElementById("line")
		let progress = document.getElementById("progress")
		let displayArea = document.getElementById("lineDiv")
		let inputs = document.getElementById("inputs")
		let finish = document.getElementById("submitBttn")

	if(lineNum<=myStorage.getItem("lines")){
		let lyrics = myStorage.getItem("lyrics").split(",")
		lyrics = lyrics.filter(function (el) {
	  		return el != "";
		});
		progress.textContent = "Line "+lineNum+"/"+myStorage.getItem("lines")
		lineText.textContent = lyrics[lineNum-1]
		displayArea.style.display = "flex"
		//console.log(lyrics)
	}
	else{
		lineText.textContent = "THANK YOU!"
		inputs.style.display = "none"
		labels.style.display = "none"
		finish.style.display = "flex"
	}
}
function upload(){
	let ratingsData = myStorage.getItem("ratings")
	//let songName = myStorage.getItem("songName")
	//let songData = {songName}
	//songData = JSON.stringify(songData)
	const xhttp = new XMLHttpRequest();
	xhttp.open("POST","/newRating",true)
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.onreadystatechange = function(){
		if(this.readyState==4 && this.status == 200){
			let endBttn = document.getElementById("submitBttn")
			let another = document.getElementById("retBttn")
			endBttn.style.display = "none"
			another.style.display = "flex"
			alert("SUCCESS!: Please close this window or click the button below to rate another song")
		}
	} 
	xhttp.send(ratingsData)
	
}