var app = angular.module('svImpact', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
'$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/pages/homepage.html',
      controller: 'MainCtrl',
      resolve: {
        projectPromise: ['projects', function(projects){
          return projects.getAll();
        }]
      }
    })
    .state('projects', {
	  url: '/projects/{id}',
	  templateUrl: '/pages/project.html',
	  controller: 'ProjectsCtrl',
    resolve: {
      project: ['$stateParams', 'projects', function($stateParams, projects) {
        return projects.get($stateParams.id);
      }]
    }
	  })
    .state('login', {
      url: '/login',
      templateUrl: '/pages/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('registerUser', {
      url: '/registerUser',
      templateUrl: '/pages/registerUser.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('registerOrg', {
      url: '/registerOrg',
      templateUrl: '/pages/registerOrg.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

  $urlRouterProvider.otherwise('home');
  $locationProvider.html5Mode(true);
}]);
