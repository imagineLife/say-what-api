const mongoose = require('mongoose');

const oratorsSchema = mongoose.Schema({
	first : {
		type: String,
		required: true
	},
	middleInitial: {
		type: String,
		required: true
	},
	last : {
		type: String,
		required: true
	},
	dob : { type: String },
	party: { type: String }
});

oratorsSchema.virtual('fullName').get(() => {
  return `${this.first} ${this.middleInitial} ${this.last}`.trim();
});

const Orator = mongoose.model('orator', oratorsSchema);

module.exports = Orator;