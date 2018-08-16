/**
* This is based off a tutorial from: https://medium.freecodecamp.org/how-to-setup-a-powerful-api-with-nodejs-graphql-mongodb-hapi-and-swagger-e251ac189649
*
*
**/

const hapi = require('hapi'); 
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://i:i@localhost:27017/pack97');
// mongoose.connection.once('open',() => {
// 	console.log("connected to db");
// });

const server = hapi.server({
	port:4477,
	host: '0.0.0.0'
});

const init = async () => {
	server.route({
		method:'GET',
		path:'/',
		handler: function(request,reply){
			return '<hi>APIs ROCK!!!!!!!!!!!!!!!!!!!!!!</h1>';
		}
	});

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

init();