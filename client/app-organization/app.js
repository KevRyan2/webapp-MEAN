var app = angular.module('svImpact.organization', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('orgDash', {
      url: '/orgDash',
      templateUrl: '/pages/orgHomepage.html',
      controller: 'MainCtrl',
      resolve: {
        projectPromise: ['projects', function(projects){
          return projects.getAll();
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
}]);
