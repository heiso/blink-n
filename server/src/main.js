var LAN = '192.168.84';
var PORT = 8934;

var app = require('express')(),
    http = require('http').Server(app),
    net = require('net'),
    request = require('request'),
    Promise = require('es6-promise').Promise;
    Socket = net.Socket;

function checkBlinkServer(host, port) {
  return new Promise(function(resolve, reject) {
    var socket = new Socket(),
        open = true;

    socket.setTimeout(1500);
    socket.on('connect', function() {
      socket.end();
    });

    socket.on('timeout', function() {
      socket.destroy();
      open = false;
    });

    socket.on('error', function() {
      open = false;
    });

    socket.on('close', function() {
      if (open) {
        resolve({
          'host': host,
          'port': port,
          'status': false
        });
      } else {
        reject(host + ' closed');
      }
    });

    socket.connect(port, host);
  });
}

function getBlinkServers() {
  var resolves = [];
  for (var i = 1; i <= 254; i++) {
    resolves.push(
      checkBlinkServer(LAN + '.' + i, PORT)
        .then(function(res) {
          return res;
        })
        .catch(function(err) {
          return null;
        })
    );
  }

  return Promise
    .all(resolves)
    .then(function(results) {
      var res = [];
      for (var i = 0; i < results.length; i++) {
        if (results[i] !== null) {
          res.push(results[i]);
        }
      }
      return res;
    });
}

http.listen(3000, function() {
  console.log('listening on *:3000');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/servers', function(req, res) {
  getBlinkServers()
    .then(function(servers) {
      res.send(servers);
    });
  // setTimeout(function() {
  //   res.send([
  //     {
  //       'name': 'test',
  //       'host': '192.168.48.54',
  //       'port': '8934'
  //     },
  //     {
  //       'name': 'test',
  //       'host': '192.168.48.54',
  //       'port': '8934'
  //     },
  //     {
  //       'name': 'test',
  //       'host': '192.168.48.54',
  //       'port': '8934'
  //     },
  //     {
  //       'name': 'test',
  //       'host': '192.168.48.54',
  //       'port': '8934'
  //     },
  //     {
  //       'name': 'test',
  //       'host': '192.168.48.54',
  //       'port': '8934'
  //     },
  //     {
  //       'name': 'test',
  //       'host': '192.168.48.54',
  //       'port': '8934'
  //     }
  //   ]);
  // }, 1000);
});
