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
	family: [{}],
	phone: String,
	isCommitee: Boolean,
	isLeader: Boolean,
	scope:[String],
	isUser: Boolean,
	pass_sec: String,
	pass_hash: String
});

module.exports = mongoose.model('Contact', ContactSchema);
