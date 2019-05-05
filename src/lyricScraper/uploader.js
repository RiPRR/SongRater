const lineByLine = require('n-readlines');
const mongoose = require('mongoose')
const db = require('../db')
const Song = mongoose.model('Song')
let lyrics = {}
let verses = []
let verse = []
var fileName = process.argv[2]
var title = process.argv[3]
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
const songToAdd = new Song({
			title:title,
			artist:artist,
			lyrics:verses
		})
songToAdd.save((err,saved,count)=>{
	console.log(saved["lyrics"][0][0])
	process.exit(0)
});
