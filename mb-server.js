var http = require('http');
//loads http module
var util= require('util');
//usefull functions
var querystring = require('querystring');
//laods querystring module, we'll need it to serialize and deserialize objects and query strings

var mongodb = require ('mongodb');
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;
var host = '127.0.0.1';
var port = 27017;

var db=new Db ('test', new Server(host,port, {}));



exports.server=http.createServer(function (req, res) {
//creates server
	if (req.method=="POST"&&req.url=="/messages/create.json") {
		//if method is POST and URL is messages/ add message to the array
		var message='';
		req.on('data', function(data, message){
			console.log(data.toString('utf-8'));
			message=exports.addMessage(data.toString('utf-8'));
			//data is type of Buffer and must be converted to string with encoding UTF-8 first
			//adds message to the array
		})
		console.log(util.inspect(message, true, null));
		console.log(util.inspect(messages, true, null));
		//debugging output into the terminal
		res.writeHead(200, {'Content-Type': 'text/plain'});
		//sets the right header and status code		
		res.end(message);
		//out put message, should add object id
	}
	if (req.method=="GET"&&req.url=="/messages/list.json") {
	//if method is GET and URL is /messages output list of messages
		var body=exports.getMessages();
		//body will hold our output
		res.writeHead(200, {
			'Content-Length': body.length,
			'Content-Type': 'text/plain'
		});
		res.end(body);
	}
	else {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		//sets the right header and status code
		res.end('Hello World\n');
	};
	console.log(req.method);

  //outputs string with line end symbol
}).listen(1337, "127.0.0.1");
//sets port and IP address of the server
console.log('Server running at http://127.0.0.1:1337/');


exports.getMessages = function() {
	new Db('test', new Server(host,port, {}), {}).open(function (error, client) {
		if (error) throw error;
		var collection = new mongodb.Collection(client, 'test_collection');
		collection.find({}, {limit:100}).toArray(function(err, docs) {
	    	console.dir(docs);
			messages=docs;
		});
	});	
	return JSON.stringify(messages);
};

exports.addMessage = function (data){
	var str;
	new Db ('test', new Server(host,port, {})).open(function (error, client) {
		if (error) throw error;
		var collection = new mongodb.Collection(client, 'test_collection');
		collection.insert(querystring.parse(data), {safe:true}, function(err, objects) {
	    	if (err) console.warn(err.message);
			console.log(objects);
			// str=data;
	    	if (err && err.message.indexOf('E11000 ') !== -1) {
	      		// this _id was already inserted in the database
	    	}
	  });
	});
};

var messages=exports.getMessages();
exports.addMessage("name=John&message=hi");