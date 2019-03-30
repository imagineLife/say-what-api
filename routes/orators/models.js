const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const oratorSchema = mongoose.Schema({
	firstName : {
		type: String,
		required: true
	},
	lastName : {
		type: String,
		required: true
	},
	dob : {
		type: Date
	},
	speeches: [type: Schema.Types.ObjectId, ref: 'Stat']
})

oratorSchema.methods.apiRepr = function(){
	return{
		id: this._id,
		type: this.type,
		text: this.text,
		Date: this.Date,
		user: this.user
	}
}

const Orator = mongoose.model('Orator', oratorSchema);

module.exports = {Orator};