const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	event_name:String,
	event_date:String,
	reg_close:String,
	desc:String,
	lead:String,
	lead_email:String,
	payment:String,
	participants:[
		{
			contact_id: String,
	        contact_first_name: String,
	        contact_last_name: String,
	        contact_phone: String,
	        contact_email: String,
	        verified: String,
	        attendees:[{}]
	    }
	]
});

module.exports = mongoose.model('Event', EventSchema);