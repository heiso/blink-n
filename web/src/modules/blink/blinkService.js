(function() {

  angular
    .module('modules.blink')
    .service('blinkService', BlinkService);

  function BlinkService($http) {
    this.getAll = getAll;

    function getAll() {
      return $http
        .get('http://127.0.0.1:3000/servers')
        .then(function(res) {
          return res.data;
        });
    }
  }

})();
