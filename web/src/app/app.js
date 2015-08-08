angular
  .module('app')
  .config(function config($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('otherwise', {
        url: '/otherwise',
        onEnter: function ($state) {
          $state.go('home');
        }
      });

    $urlRouterProvider.otherwise('/otherwise');

  })
  .run(function run($rootScope) {

    // DEV route tests
    // $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
    //   console.log('Start');
    //   console.log('  fromState', fromState.name, fromParams);
    //   console.log('  toState', toState.name, toParams);
    // });
    // $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
    //   console.log('Success');
    //   console.log('  fromState', fromState.name, fromParams);
    //   console.log('  toState', toState.name, toParams);
    //   console.log('');
    // });
    // $rootScope.$on('$stateChangeError', function (evt, toState, toParams, fromState, fromParams, error) {
    //   console.log('Error');
    //   console.log('  fromState', fromState.name, fromParams);
    //   console.log('  toState', toState.name, toParams);
    //   console.log('  error', error);
    // });
    // $rootScope.$on('$stateNotFound', function (evt, unfoundState, fromState, fromParams) {
    //   console.log('NotFound');
    //   console.log('  fromState', fromState.name, fromParams);
    //   console.log('  unfoundState', unfoundState.to, unfoundState.toParams);
    // });

  })
  .controller('appCtrl', function controller() {


  });
