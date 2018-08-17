/**
* This is based off a tutorial from: https://medium.freecodecamp.org/how-to-setup-a-powerful-api-with-nodejs-graphql-mongodb-hapi-and-swagger-e251ac189649
*
*
**/

const hapi = require('hapi'); 
const mongoose = require('mongoose');
const Scout = require('./models/scout');

mongoose.connect('mongodb://mongo/pack97');
mongoose.connection.once('open',() => {
	console.log("connected to db");
});

console.log("/n/n/n Test /n/n/n/n");
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
				return '<hi>APIs ROCK!!!!!!!!!!!!!!!!!!!!!!</h1>';
			}
		},
		{
			method:'GET',
			path: '/api/pack97/scout',
			handler:(req, reply) =>{
				console.log(`Succefully hit scout endpoint with ${req}`);
				return Scout.find();
			}
		},
		{
			method:'POST',
			path: '/api/pack97/scout',
			handler: (req,reply) =>{
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
		}
	]);

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

init();