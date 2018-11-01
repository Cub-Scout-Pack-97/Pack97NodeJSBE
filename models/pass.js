const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PassSchema = new Schema({
	email: String,
	pass_hash: String,
	pass_sec: String
});

module.exports = mongoose.model('Pass', PassSchema);