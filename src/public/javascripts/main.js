let myStorage = window.localStorage
window.addEventListener('load', function() {
	const logSwitch = document.getElementById("regSwitch")
	const accessText =  document.getElementById("accessText")
	const access = document.getElementById("access")
	const surveyBttn = document.getElementById("surveyBttn")
	const lineDiv = document.getElementById("lineDiv")
	const begin = document.getElementById("beginSurvey")
	const nextBttn = document.getElementById("nextBttn")
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
		//myStorage.setItem("lineNum","1")
		//myStorage.setItem("totalLines","10")
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if(this.readyState==4 && this.status == 200){
				let data = (xhttp.responseText)
				myStorage.setItem("songData",data)
			}
		} 
		xhttp.open("GET","/songData",true)
		xhttp.send()
	}
	if(begin){
		begin.addEventListener("click",function(){
			processData()
		})
	}
	if(nextBttn){
		nextBttn.addEventListener("click",function(){
			let curLine = Number(myStorage.getItem("curLine"))
			curLine+=1
			myStorage.setItem("curLine",curLine)
			renderLine(curLine)
		})
	}
})
function renderLine(lineNum){
	let lyrics = myStorage.getItem("lyrics").split(",")
	lyrics = lyrics.filter(function (el) {
  		return el != "";
	});
	let lineText = document.getElementById("line")
	let progress = document.getElementById("progress")
	let displayArea = document.getElementById("lineDiv")
	progress.textContent = "Line "+lineNum+"/"+myStorage.getItem("lines")
	lineText.textContent = lyrics[lineNum-1]
	displayArea.style.display = "flex"
	//console.log(lyrics)
}
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