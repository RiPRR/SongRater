const lineByLine = require('n-readlines');
const mongoose = require('mongoose')
const db = require('../db')
const Rating = mongoose.model('Rating')
let lyrics = {}
let verses = []
let verse = []
var fileName = process.argv[2]
var song = process.argv[3]
var artist = process.argv[4]
//console.log(fileName+" "+song+" "+artist)
const liner = new lineByLine(fileName);

let line;
let lineNumber = 0;

while (line = liner.next()) {
	fLine = line.toString('ascii')
    //console.log('Line ' + lineNumber + ': ' + line.toString('ascii'));
    lineNumber++;
    if( fLine.length>2){
    	verse.push(fLine)
    }
    else{
    	toAdd = verse.slice()
    	verses.push(toAdd)
    	verse = []
    }
}
verses.shift()
const ratingToAdd = new Rating({
			title:"sultans_of_swing",
			artist:"dire_straits",
			user:"test",
			data:verses
		})
ratingToAdd.save((err,saved,count)=>{
	console.log(saved["data"][0][0])
	process.exit(0)
});
