var app = angular.module('svImpact.user', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
'$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('userDash', {
      url: '/',
      templateUrl: 'pages/userHomepage.html',
      controller: 'MainCtrl',
      resolve: {
        projectPromise: ['projects', function(projects){
          return projects.getAll();
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
  $locationProvider.html5Mode(true);
}]);
