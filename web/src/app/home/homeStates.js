angular
  .module('app.home')
  .config(function config($stateProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          'main': {
            'templateUrl': 'app/home/homeIndex.tpl.html',
            'controller': 'homeIndexCtrl as vm'
          }
        }
      });

  });
