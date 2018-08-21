/**
* This is based off a tutorial from: https://medium.freecodecamp.org/how-to-setup-a-powerful-api-with-nodejs-graphql-mongodb-hapi-and-swagger-e251ac189649
*
*
**/

const hapi = require('hapi'); 
const mongoose = require('mongoose');
const Scout = require('./models/scout');
const Parent = require('./models/parent');

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
				return Scout.deleteOne({_id:req.params.id});
			}
		},
		{
			// ****************************************** Parents Routes ************************
			/*
				@method GET
				@path /api/pack97/parent/id/{id}
					{id} is the _id value
			 	@description Returns the parent how's _id is passed
			*/
			method:'GET',
			path: '/api/pack97/parent/id/{id}',
			handler:(req, reply) =>{
				connectDB();
				const id = req.params.id;
				return Parent.findById(id);
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/parent/list
			 	@description Returns a list of all our parents
			*/	
			method:'GET',
			path: '/api/pack97/parent/list',
			handler:(req, reply) =>{
				connectDB();
				return Parent.find({});
			}
		},
		{
			/*
				@method POST
				@path /api/pack97/parent
					Schema:
						{
							bsaid: String,
							first_name: String,
							last_name: String,
							gender: String,
							family: [{}],
							phone: String,
							email: String
						}
			 	@description Add a Parent
			*/
			method:'POST',
			path: '/api/pack97/parent',
			handler: (req,reply) =>{
				connectDB();
				const {bsaid,first_name,last_name,gender,family,phone,email} = req.payload;
				const parent = new Parent({
					bsaid,
					first_name,
					last_name,
					gender,
					family,
					phone,
					email
				});

				return parent.save();
			}
		},
		{
			/*
				@method GET
				@path /api/pack97/parent/del/{id}
					{id} is the _id value
			 	@description Removes the parent how's _id is passed
			*/
			method:'GET',
			path: '/api/pack97/parent/del/{id}',
			handler: (req,reply)=>{
				return Parent.deleteOne({_id:req.params.id});
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
			path: '/api/pack97/parent/add/family',
			handler:(req,reply)=>{
				const pId = req.payload._id;
				return Parent.findById(pId, function(err,parent){
					if (err) return handleError(`Could not find parent ${err}`);
					parent.family.push(req.payload.family);
					parent.save();
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
			path: '/api/pack97/parent/remove/family',
			handler:(req,reply)=>{
				const pId = req.payload._id;
				const element = req.payload.element;
				return Parent.findById(pId, function(err,parent){
					if (err) return handleError(`Could not find parent ${err}`);
					parent.family.splice(element,1);
					parent.save();
				});
			}
		}
	]);
	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

init();