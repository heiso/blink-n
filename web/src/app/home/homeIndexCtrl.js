(function() {

  angular
    .module('app.home')
    .controller('homeIndexCtrl', HomeIndexCtrl);

  function HomeIndexCtrl(blinkServers) {
    var vm = this;

    vm.blinkServers = blinkServers;
  }

})();
