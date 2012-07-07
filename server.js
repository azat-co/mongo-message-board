var http = require('http');
var util = require('util');
var querystring = require('querystring');
var mongo = require('mongodb');

var host = '127.0.0.1';
var port = 27017;

var db= new mongo.Db('test', new mongo.Server(host,port,{}));

db.open( function(error, client) {
	if (error) throw error;
	var collection = new mongo.Collection(client, 'test_collection');
	var app = http.createServer( function (request, response) {
		if (request.method==="GET"&&request.url==="/messages/list.json") {
			collection.find().toArray(function(error,results) {
				response.writeHead(200,{'Content-Type':'text/plain'});
				console.dir(results);
				response.end(JSON.stringify(results));
			});
		};
		if (request.method==="POST"&&request.url==="/messages/create.json") {
			request.on('data', function(data) {
				collection.insert(querystring.parse(data.toString('utf-8')), {safe:true}, function(error, obj) {
					if (error) throw error;
					response.end(JSON.stringify(obj));
				})				
			})

		};
	});
	// console.log(util.inspect(app))
	// app.listen(1337, '127.0.0.1');
	var port = process.env.PORT || 5000;
	app.listen(port, function() {
	  console.log("Listening on " + port);
	});
})
