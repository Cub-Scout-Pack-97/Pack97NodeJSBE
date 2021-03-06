'use strict';
/**
* This is based off a tutorial from: https://medium.freecodecamp.org/how-to-setup-a-powerful-api-with-nodejs-graphql-mongodb-hapi-and-swagger-e251ac189649
*
*
**/

const hapi = require('hapi'); 
const mongoose = require('mongoose');
const crypto = require('crypto');
const Scout = require('./models/scout');
const Event = require('./models/event');
const Contact = require('./models/contact');
const Password = require('./models/pass');

function connectDB(){
	if(mongoose.connection.readyState === 0 ){
		mongoose.connect('mongodb://10.5.0.6:27017/pack97');
		mongoose.connection.once('open',() => {
			console.log("connected to db");
		});
	}
}

const server = hapi.server({
	port:4477,
	host: '0.0.0.0'
});

const init = async () => {
	server.route([
		{
			method:'GET',
			path:'/',
			handler: function(request,reply){
				return '<hi>APIs ROCK!</h1><h2>IT WORKED!!!</h2>';
			}
		},
		{
			// ************************************** Scout Routes *****************************
			/*
				@method GET
				@path /api/pack97/scout/id/{id} 
					{id} is the _id value
			 	@description Find an individual Scout by the Mongo definded _id field
			*/
			method:'GET',
			path: '/api/pack97/scout/id/{id}',
			handler:(req, reply) =>{
				connectDB();
				const id = req.params.id;
				return Scout.findById(id);
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/scout/name/{first_name}/{last_name} 
					{id} is the _id value
			 	@description Find an individual Scout by the Mongo definded _id field
			*/
			method:'GET',
			path: '/api/pack97/scout/name/{first_name}/{last_name}',
			handler:(req, reply) =>{
				connectDB();
				const first = req.params.first_name;
				const last = req.params.last_name;
				return Scout.find({first_name:new RegExp(first, 'i'),last_name:new RegExp(last, 'i')});
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/scout/list
			 	@description Returns a list of all our scouts
			*/
			method:'GET',
			path: '/api/pack97/scout/list',
			handler:(req, reply) =>{
				connectDB();
				return Scout.find({});
			}
		},
		{
			/*
				@method POST
				@path /api/pack97/scout
					Schema:
						{
							bsaid: String,
							first_name: String,
							last_name: String,
							gender: String,
							family: [{}],
							achevments: [{}],
							rank: String,
							den: String
						}
			 	@description Add a Scout
			*/
			method:'POST',
			path: '/api/pack97/scout',
			handler: (req,reply) =>{
				connectDB();
				const {bsaid,first_name,last_name,gender,family,achevments,rank,den} = req.payload;
				const scout = new Scout({
					bsaid,
					first_name,
					last_name,
					gender,
					family,
					achevments,
					rank,
					den
				});

				return scout.save();
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/scout/del/{id}
					{id} is the _id value
			 	@description Removes the scout how's _id is passed
			*/
			method:'GET',
			path: '/api/pack97/scout/del/{id}',
			handler: (req,reply)=>{
				connectDB();
				return Scout.deleteOne({_id:req.params.id});
			}
		},
		{
			/*
				@method Post
				@path /api/pack97/scout/update
					
					Schema
						Scout:
							{
								bsaid: String,
								first_name: String,
								last_name: String,
								gender: String,
								family: [{}],
								achevments: [{}],
								rank: String,
								den: String
							}

			 	@description Updates the parent's info, how's _id is passed
			*/
			method:'POST',
			path: '/api/pack97/scout/update',
			handler:(req,reply)=>{
				connectDB();
				const pId = req.payload._id;
				return Scout.findById(pId, function(err,scout){
					if (err) return handleError(`Could not find scout ${err}`);
					scout.bsaid = req.payload.bsaid;
					scout.first_name = req.payload.first_name;
					scout.last_name = req.payload.last_name;
					scout.gender = req.payload.gender;
					scout.family = req.payload.family;
					scout.phone = req.payload.phone;
					scout.email = req.payload.email;
					scout.save();
				});
			}
		},
		{
			/************************************** Contacts Info ******************************/
			/*
				@method POST
				@path /api/pack97/contact
					Schema:
						{
							bsaid: String,
							first_name: String,
							last_name: String,
							gender: String,
							title: String,
							desc: String,
							email: String
						}
			 	@description Add a Scout
			*/
			method:'POST',
			path: '/api/pack97/contact',
			handler: (req,reply) =>{
				connectDB();
				const {bsaid,first_name,last_name,gender,title,desc,email,phone,isCommitee,isLeader,scope} = req.payload;
				const contact = new Contact({
					bsaid,
					first_name,
					last_name,
					gender,
					title,
					desc,
					email,
					phone,
					isCommitee,
					isLeader,
					scope
				});

				return contact.save();
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/parent/email/{email}
			 	@description Returns a list of all our parents
			*/	
			method:'GET',
			path: '/api/pack97/contact/email/{email}',
			handler: async (req, reply) =>{
				connectDB();
				let contacts = await Contact.find({email:req.params.email});
				contacts.forEach((contact) => {
					contact.pass_sec = undefined;
					contact.pass_hash = undefined;
				});
				
				return contacts;
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/parent/email/{email}
			 	@description Returns a list of all our parents
			*/	
			method:'GET',
			path: '/api/pack97/contact/id/{id}',
			handler: async (req, reply) =>{
				connectDB();
				let contact = await Contact.findById(req.params.id);
				contact.pass_sec = undefined;
				contact.pass_hash = undefined;
				return contact;
			}
		},
		{
			/*
			@method Post
			@path /api/pack97/parent/add/family
				
				Schema
					Scout:
						_id: String,
						family: {
							bsaid: String,
							first_name: String,
							last_name: String,
							gender: String,
							rank: String,
							den: String	
						}
					Other:
						_id: String,
						family:{
							first_name: String,
							last_name: String,
							gender: String
						}


		 	@description Adds a person to the parent's family attribute, how's _id is passed
			*/
			method:'POST',
			path: '/api/pack97/contact/add/family',
			handler:(req,reply)=>{
				connectDB();
				const pId = req.payload._id;
				return Contact.findById(pId, function(err,contact){
					if (err) return handleError(`Could not find parent ${err}`);
					contact.family.push(req.payload.family);
					contact.save();
				});
			}
		},
		{
			/*
				@method Post
				@path /api/pack97/parent/add/family
					
					Schema
						_id: String,
						element: Number
			 	@description Removes the person to the parent's family attribute, how's possition in the array is passed
			*/
			method:'POST',
			path: '/api/pack97/contact/remove/family',
			handler:(req,reply)=>{
				connectDB();
				const pId = req.payload._id;
				const element = req.payload.element;
				return Contact.findById(pId, function(err,contact){
					if (err) return handleError(`Could not find parent ${err}`);
					contact.family.splice(element,1);
					contact.save();
				});
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/leader/list
			 	@description Returns a list of all our parents
			*/	
			method:'GET',
			path: '/api/pack97/leader/list',
			handler: async (req, reply) =>{
				connectDB();
				let contacts = await Contact.find().where('isLeader').equals('true');
				contacts.forEach((contact) => {
					contact.pass_sec = undefined;
					contact.pass_hash = undefined;
				});
				return contacts;
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/leader/list
			 	@description Returns a list of all our parents
			*/	
			method:'GET',
			path: '/api/pack97/committee/list',
			handler: async (req, reply) =>{
				connectDB();
				let contacts = await Contact.find().where('isCommitee').equals('true');
				contacts.forEach((contact) => {
					contact.pass_sec = undefined;
					contact.pass_hash = undefined;
				});
				return contacts;
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/leader/list
			 	@description Returns a list of all our parents
			*/	
			method:'GET',
			path: '/api/pack97/contact/list',
			handler: async (req, reply) =>{
				connectDB();
				let contacts = await Contact.find();
				contacts.forEach((contact) => {
					contact.pass_sec = undefined;
					contact.pass_hash = undefined;
				});
				return contacts;
			}
		},
		{
			/*
				@method Post
				@path /api/pack97/contact/update
					
					Schema
						Contact:
							{
								bsaid: String,
								first_name: String,
								last_name: String,
								gender: String,
								title: String,
								desc: String,
								email: String,
								isCommitee: Boolean,
								isLeader: Boolean
							}

			 	@description Updates the contact's info, how's _id is passed
			*/
			method:'POST',
			path: '/api/pack97/contact/update',
			handler:(req,reply)=>{
				connectDB();
				const cId = req.payload._id;
				return Contact.findById(cId, function(err,contact){
					if (err) return handleError(`Could not find parent ${err}`);
					contact.bsaid = req.payload.bsaid;
					contact.first_name = req.payload.first_name;
					contact.last_name = req.payload.last_name;
					contact.gender = req.payload.gender;
					contact.title = req.payload.title;
					contact.desc = req.payload.desc;
					contact.email = req.payload.email;
					contact.phone = req.payload.phone;
					contact.isCommitee = req.payload.isCommitee;
					contact.isLeader = req.payload.isLeader;
					contact.isUser = req.payload.isUser;
					contact.scope = req.payload.scope;
					contact.save();
				});
			}
		},
		{
			method:'POST',
			path: '/api/pack97/contact/update/isUser',
			handler:(req,reply)=>{
				connectDB();
				const cId = req.payload._id;
				return Contact.findById(cId, function(err,contact){
					if (err) return handleError(`Could not find parent ${err}`);
					contact.isUser = req.payload.isUser;
					contact.save();
				});
			}
		},
		{
			//******************************** Password Handling ********************************

			/*

			*/
			method:'POST',
			path:'/api/pack97/password/new',
			handler: async (req,reply) => {
				connectDB();
				const id = req.payload._id;
				const email = req.payload.email;
				const pass = req.payload.password;
				const hashed = sha512(pass,genRandomString(20));
				const emailFound = await Contact.find({email:email});
				let response = {"response":"We're currently experencing an issue. Please try again"};
				
				if(emailFound.length < 1 && emailFound[0].isUser !== true && emailFound[0]._id !== id ){
					return {'response':'The email you entered cannot be found or you already have a password'};
				}else{
					response = await Contact.update({email:email},{
							pass_hash: hashed.passwordHash,
							pass_sec: hashed.salt
						}, (err, numberAffected, rawResponse) => {
						   if(err){
								return {'response':'We were unable to save your password. Please try again.'};
							}else{
								return {'response':numberAffected};
							}
						}
					);
					return response;
				}
			}
		},
		{
			/* 
				
			*/
			method:'POST',
			path:'/api/pack97/user/validation',
			handler: async (req,h) => {
				connectDB();
				const email = req.payload.email;
				const pass = req.payload.password.toString();
				let isValid = {"response":"Either your password or email are incorrect"};
				const user = await Contact.find({email:email});
				if(user.length > 0){
					const hashed = sha512(pass,user[0].pass_sec);
					if(hashed.passwordHash === user[0].pass_hash){
						isValid = {
							"response":"success",
							"user": user[0].first_name + " " + user[0].last_name,
							"id": user[0]._id,
							"scope": user[0].scope
						};
					}
				}
				return isValid;
			}

		},
		{
			/*

			*/
			method:'GET',
			path:'/api/pack97/user/change/password/{secret}',
			handler: async (req,h) =>{
				connectDB();
				const user = await Password.find({pass_sec:req.params.secret});
				return user[0].email;
			}
		},
		{
			//******************************** Event Handling ********************************
			/*
			
			*/
			method:'POST',
			path: '/api/pack97/event/new',
			handler: (req,h)=>{
				connectDB();
				const {event_name,event_date,event_time,location,reg_close,select_image,enabled,visible,lead_notify,cost_scout,cost_leader,cost_adult,cost_other,child_age_min,child_age_max,cost_other2,child_age_min2,child_age_max2,online_sales,backpacking,tshirt,desc,lead,lead_email,payment, participants} = req.payload;
				const event = new Event({
					event_name,
					event_date,
					event_time,
					location,
					reg_close,
					select_image,
					enabled,
					visible,
					lead_notify,
					cost_scout,
					cost_leader,
					cost_adult,
					cost_other,
					child_age_min,
					child_age_max,
					cost_other2,
					child_age_min2,
					child_age_max2,
					online_sales,
					backpacking,
					tshirt,
					desc,
					lead,
					lead_email,
					payment,
					participants
				});

				return event.save();
			}
		},
		{
			method:'POST',
			path: '/api/pack97/event/update',
			handler: async (req,h)=>{
				connectDB();
				let response = {"response":"We're currently experencing an issue. Please try again"};
				const user = await Event.update({_id:req.payload.event_id}, req.payload, (err, numberAffected, rawResponse) => {
					   if(err){
							response = {'response':'We were unable to update your event. Please try again.' + err};
						}else{
							response = {'response':numberAffected};
						}
					});
				return response;
			}
		},
		{
			method:'GET',
			path: '/api/pack97/event/list/{field}/{direction}',
			handler: (req,h) => {
				connectDB();
				const sort = `{"${req.params.field}":${req.params.direction}}`;
				return Event.find().sort(JSON.parse(sort));
			}
		},
		{
			/*
			
			*/
			method:'GET',
			path: '/api/pack97/event/{id}',
			handler: async (req,h)=>{
				connectDB();
				return await Event.findById(req.params.id);
			}
		},
		{
			/*
			@method Post
			@path /api/pack97/parent/add/family
				
				Schema
					Scout:
						_id: String,
						family: {
							bsaid: String,
							first_name: String,
							last_name: String,
							gender: String,
							rank: String,
							den: String	
						}
					Other:
						_id: String,
						family:{
							first_name: String,
							last_name: String,
							gender: String
						}


		 	@description Adds a person to the parent's family attribute, how's _id is passed
			*/
			method:'POST',
			path: '/api/pack97/event/add/attendees',
			handler: async(req,h)=>{
				connectDB();
				const pId = req.payload.event_id;
				return await Event.findById(pId, function(err,event){
					if (err) return handleError(`Could not find parent ${err}`);
					const attendees = {
						"contact_id":req.payload.contact_id,
						"contact_first_name":req.payload.contact_first_name,
						"contact_last_name":req.payload.contact_last_name,
						"contact_phone":req.payload.contact_phone,
						"contact_email":req.payload.contact_email,
						"verified":req.payload.verified,
						"attendees":req.payload.attendees
					}
					event.participants.push(attendees);
					event.save();
				});
			}
		},
		{
			/*

			*/
			method:'POST',
			path:'/api/pack97/event/remove/contact',
			handler: async (req,h) =>{
				connectDB();
				return await Event.findById(req.payload._id, function(err,event){
					if (err) return handleError(`Could not find parent ${err}`);
					event.participants.splice(req.payload.element,1);
					event.save();
				});
			}

		},
		{
			/*

			*/
			method:'POST',
			path:'/api/pack97/event/remove/attendees',
			handler: async (req,h) =>{
				connectDB();
				return await Event.findById(req.payload._id, function(err,event){
					if (err) return handleError(`Could not find parent ${err}`);
					
					event.participants[req.payload.pelement].attendees.splice(req.payload.aelement,1);
					event.save();
				});
			}

		},
		// {
		// 	/**/

		// 	method:'GET',
		// 	path:'/api/pack97/event/isregistered/{event}/{contact}',
		// 	handler: async (req,h) => {
		// 		connectDB();
		// 		const isReg = true;
		// 		try{
		// 			const contact = await Event.find({"_id":req.params.event,"participants._id":req.params.contact});
		// 			if(contact.length === 0){
		// 				isReg = false;
		// 			}
		// 		}catch(err){
		// 			console.log(err);
		// 			return false;
		// 		}
		// 		return isReg;
		// 	}
		// }
	]);
	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

let genRandomString = (length) => {
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex')
		.slice(0,length);
}

let sha512 = (password,salt) => {
	const hash = crypto.createHmac('sha512',salt);
	hash.update(password);
	const value = hash.digest('hex');
	return {
		salt:salt,
		passwordHash:value
	}
}

init();