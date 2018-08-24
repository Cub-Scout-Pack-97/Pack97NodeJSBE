const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
	bsaid: String,
	first_name: String,
	last_name: String,
	gender: String,
	title: String,
	desc: String,
	email: String,
	isCommitee: Boolean,
	isLeader: Boolean,
	pass_hash: String
});

module.exports = mongoose.model('Contact', ContactSchema);