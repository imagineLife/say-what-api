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
	speechTextFile: {
		type: String
	},
	imageFile: {
		type: String
	},
	eventOverview: {
		type: String
	},
	oratorID: { type: Schema.Types.ObjectId, ref: 'orator'}
})

speechSchema.methods.apiRepr = function(){
	return{
		id: this._id,
		title: this.title,
		Orator: this.Orator,
		Date: this.Date,
		speechTextFile: this.speechTextFile,
		imageFile: this.imageFile,
		eventOverview: this.eventOverview
	}
}

const Stat = mongoose.model('quickstat', speechSchema);

module.exports = {Stat};