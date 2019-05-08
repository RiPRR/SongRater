const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const hbs = require("hbs")
const sanitize = require("mongo-sanitize")
const expressSession = require('express-session');
const passport = require("passport")
const cookieParser = require('cookie-parser')
const initPassport = require("./passport/init")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession({
	secret:"secretKey", 
	resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.static(__dirname + '/../public'))
app.set("view-engine","hbs")

const routes = require("./routes/index")(passport)
app.use("/",routes)

//initiates Passport auth
initPassport(passport)


app.listen(process.env.PORT || 3000,()=>console.log("Listening"));