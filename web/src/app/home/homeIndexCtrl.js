(function() {

  angular
    .module('app.home')
    .controller('homeIndexCtrl', HomeIndexCtrl);

  function HomeIndexCtrl($http, blinkService) {
    var vm = this;
    var loading = false;

    vm.servers = [];
    vm.patterns = [
      {
        'icon': 'email',
        'code': 'mail'
      }
    ];
    vm.showEmptyList = false;
    vm.showLoading = false;

    vm.refreshServers = refreshServers;
    vm.broadcastPattern = broadcastPattern;
    vm.toggle = toggle;

    function refreshServers() {
      loading = true;
      vm.servers = [];
      _render();
      blinkService
        .getAll()
        .then(function(res) {
          loading = false;
          vm.servers = _.map(res, function(server) {
            _getLastColor(server)
              .then(function(res) {
                server.color = res;
              });
            server.name = _.capitalize(server.name);
            return server;
          });
          _render();
        });
    }

    function broadcastPattern(pattern) {
      for (var i = 0; i < vm.servers.length; i++) {
        _playPattern(vm.servers[i], pattern);
      }
    }

    function toggle(server) {
      if (!server.status) {
        _on(server, '#FF0000');
      } else {
        _off(server);
      }
    }

    function _on(server, color) {
      color = color.replace('#', '%23');
      $http
        .get('http://'+server.host+':'+server.port+'/blink1/fadeToRGB?rgb='+color+'&time=3')
        .then(function(res) {
          if (res.status == 200) {
            server.status = true;
            _getLastColor(server)
              .then(function(res) {
                server.color = res;
              });
          }
        });
    }

    function _off(server) {
      $http
        .get('http://'+server.host+':'+server.port+'/blink1/off')
        .then(function(res) {
          if (res.status == 200) {
            server.status = false;
          }
        });
    }

    function _playPattern(server, pattern) {
      $http
        .get('http://'+server.host+':'+server.port+'/blink1/pattern/play?pname='+pattern)
        .then(function(res) {
          if (res.data.status === 'pattern play') {
            _getLastColor(server)
              .then(function(res) {
                server.color = res;
              });
          }
        });
    }

    function _getLastColor(server) {
      return $http
        .get('http://'+server.host+':'+server.port+'/blink1/lastColor')
        .then(function(res) {
          return res.data.lastColor;
        });
    }

    function _render() {
      if (vm.servers.length > 0 || loading) {
        vm.showEmptyList = false;
      } else {
        vm.showEmptyList = true;
      }

      vm.showLoading = loading;
    }

    refreshServers();
  }

})();
