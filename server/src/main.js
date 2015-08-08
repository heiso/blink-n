var LAN = '192.168.1';
var PORT = 8934;

var net = require('net'),
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
          'port': port
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


getBlinkServers()
  .then(function(servers) {
    for (var i = 0; i < servers.length; i++) {
      console.log('activate', servers[i]);
      request({
        'url': 'http://'+servers[i].host+':'+servers[i].port+'/blink1/pattern/play',
        'qs': {
          'pname': 'rain'
        }
      });
    }
  });
