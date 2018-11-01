const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoutSchema = new Schema({
	bsaid: String,
	first_name: String,
	last_name: String,
	gender: String,
	family: [{}],
	achevments: [{}],
	rank: String,
	den: String
});

module.exports = mongoose.model('Scout', ScoutSchema);