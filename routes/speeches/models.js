const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const speechSchema = mongoose.Schema({
	title : {
		type: String,
		required: true
	},
	Orator : {
		type: String,
		required: true
	},
	Date : {
		type: Date,
		required: true
	},
	Audience : {
		type: String,
		required: true
	},
	numberOfWords : {
		wordCount : Number,
		uniqueWords : Number
	},
	mostUsedWords : [
		{
			word : String,
			occurances : Number
		}
	],
	wordsBySize : [
		{
			size : Number,
			occurances : Number
		}
	],
	bigWords : [String],
	speechTextLink: {
		type: String
	},
	imageLink: {
		type: String
	}
})

speechSchema.methods.apiRepr = function(){
	return{
		id: this._id,
		title: this.title,
		Orator: this.Orator,
		Date: this.Date,
		Audience: this.Audience,
		numberOfWords: this.numberOfWords,
		mostUsedWords: this.mostUsedWords,
		wordsBySize: this.wordsBySize,
		bigWords: this.bigWords,
		speechTextLink: this.speechTextLink,
		imageLink: this.imageLink
	}
}

const Stat = mongoose.model('quickstat', speechSchema);

module.exports = {Stat};