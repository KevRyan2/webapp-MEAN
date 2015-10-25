var app = angular.module('svImpact.organization', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
'$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('orgDash', {
      url: '/',
      templateUrl: 'pages/orgHomepage.html',
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
