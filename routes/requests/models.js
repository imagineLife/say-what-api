const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const requestSchema = mongoose.Schema({
	type : {
		type: Number,
		required: true
	},
	text : {
		type: String,
		required: true
	},
	Date : {
		type: Date,
		required: true
	},
	user : {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	}
})

speechSchema.methods.apiRepr = function(){
	return{
		id: this._id,
		type: this.type,
		text: this.text,
		Date: this.Date,
		user: this.user
	}
}

const Request = mongoose.model('request', requestSchema);

module.exports = {Request};