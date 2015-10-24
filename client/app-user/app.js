var app = angular.module('svImpact.user', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('userDash', {
      url: '/userDash',
      templateUrl: '/pages/userHomepage.html',
      controller: 'MainCtrl',
      resolve: {
        projectPromise: ['projects', function(projects){
          return projects.getAll();
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
}]);
