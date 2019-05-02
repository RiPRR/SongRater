window.addEventListener('load', function() {
	const logSwitch = document.getElementById("regSwitch")
	const accessText =  document.getElementById("accessText")
	const access = document.getElementById("access")
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
})