const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	event_name:String,
	event_date:String,
	event_time:String,
	reg_close:String,
	location:String,
	enabled:Boolean,
	visible:Boolean,
	lead_notify:Boolean,
	select_image:String,
	cost_scout:Schema.Types.Decimal128,
	cost_leader:Schema.Types.Decimal128,
	cost_adult:Schema.Types.Decimal128,
	cost_other:Schema.Types.Decimal128,
	child_age_min:Number,
	child_age_max:Number,
	cost_other2:Schema.Types.Decimal128,
	child_age_min2:Number,
	child_age_max2:Number,
	online_sales:String,
	backpacking:Boolean,
	tshirt:Boolean,
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