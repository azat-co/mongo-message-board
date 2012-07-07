var http = require('http');
var util = require('util');
var querystring = require('querystring');
var mongo = require('mongodb');


var host = process.env.MONGOHQ_URL || "mongodb://@127.0.0.1:27017";
//MONGOHQ_URL=mongodb://user:pass@server.mongohq.com/db_name
mongo.Db.connect(process.env.MONGOHQ_URL, function(error, client) {
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
	var port = process.env.PORT || 5000;
	app.listen(port);
})
