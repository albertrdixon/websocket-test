var http = require("http")
var ws = require("nodejs-websocket")
var fs = require("fs")
var util = require('util')

process.on('SIGTERM', function() {
  console.log((new Date()) + " Quitting")
  process.exit(0)
})
process.on('SIGINT', function() {
  console.log((new Date()) + " Quitting")
  process.exit(0)
})

http.createServer(function (req, res) {
  console.log((new Date()) + " New http stream on port 8080: url=%s headers=%j", req.url, req.headers)
	fs.createReadStream("index.html").pipe(res)
}).listen(8080)

var server = ws.createServer(function (connection) {
  console.log((new Date()) + ' New ws connection: path=%s headers=%j', connection.path, connection.headers)
	connection.nickname = null
	connection.on("text", function (str) {
		if (connection.nickname === null) {
			connection.nickname = str
			broadcast(str+" entered")
		} else
			broadcast("["+connection.nickname+"] "+str)
	})
	connection.on("close", function () {
		broadcast(connection.nickname+" left")
	})
})
server.listen(8081)

function broadcast(str) {
  // console.log((new Date()) + "Broadcast '" + str + "' to conns: " + util.inspect(server.connections, false, null))
	server.connections.forEach(function (connection) {
    console.log((new Date()) + " Broadcast '%s' to %s", str, connection.str)
		connection.sendText(str)
	})
}
