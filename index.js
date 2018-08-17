/**
* This is based off a tutorial from: https://medium.freecodecamp.org/how-to-setup-a-powerful-api-with-nodejs-graphql-mongodb-hapi-and-swagger-e251ac189649
*
*
**/

const hapi = require('hapi'); 
const mongoose = require('mongoose');
const Scout = require('./models/scout');

const options = {
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};



mongoose.connect('mongodb://localhost:27017/pack97');
mongoose.connection.once('open',() => {
	console.log("connected to db");
});

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
				return '<hi>APIs ROCK!!!!!!!!!!!!!!!!!!!!!!</h1><h2>It would be cool if this works</h2>';
			}
		},
		{
			method:'GET',
			path: '/api/pack97/scout',
			handler:(req, reply) =>{
				return Scout.find();
			}
		},
		{
			method:'POST',
			path: '/api/pack97/scout',
			handler: (req,reply) =>{

				console.log(req.payload);
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