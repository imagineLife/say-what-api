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
	mostUsedWords : [{}],
	wordsBySize : [{}],
	bigWords : [String]

})

speechSchema.methods.apiRepr = function(){
	return{
		id: this._id,
		milesTraveled: this.milesTraveled,
		date: this.date,
		user: this.user
	}
}

const Speech = mongoose.model('Speeche', speechSchema);

module.exports = {Speech};