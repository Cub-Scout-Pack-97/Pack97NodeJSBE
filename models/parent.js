const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParentSchema = new Schema({
	bsaid: String,
	first_name: String,
	last_name: String,
	gender: String,
	family: [{}],
	phone: String,
	email: String
});

module.exports = mongoose.model('Parent', ParentSchema);