var http = require('http');
var assert = require('assert');
var querystring = require('querystring');
var util = require('util');

var messageBoard = require('./mb-server');

messageBoard.getMessages();
// console.log(messageBoard.Messages());
// assert.ok(messageBoard.Messages().length > 0);
// assert.deepEqual('[{"name":"John","message":"hi"}]', messageBoard.getMessages());
// assert.deepEqual('{"name":"Jake","message":"gogo"}',messageBoard.addMessage("name=Jake&message=gogo"));
// assert.deepEqual('[{"name":"John","message":"hi"},{"name":"Jake","message":"gogo"}]', messageBoard.getMessages("name=Jake&message=gogo"));