

app.controller('MainCtrl', [
'$scope',
'projects',
'auth',
'$location', 
'$window',
'$rootScope',
function ($scope, projects, auth, $location, $window, $rootScope){
  $scope.projects = projects.projects;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.addProject = function(){
    if(!$scope.title || $scope.title === '') { return; }
    projects.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  };
  $scope.incrementUpvotes = function(project) {
    projects.upvote(project);
  };

}]);
app.controller('ProjectsCtrl', [
'$scope',
'projects',
'project',
'auth',
function($scope, projects, project, auth){
  $scope.project = project;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.addComment = function(){
    if($scope.body === '') { return; }
    projects.addComment(project._id, {
      body: $scope.body,
      author: 'user',
    }).success(function(comment) {
      $scope.project.comments.push(comment);
    });
    $scope.body = '';
  };
  $scope.incrementUpvotes = function(comment) {
    projects.upvoteComment(project, comment);
    comment.upvotes += 1;
  };
}]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
'$location', 
'$window',
'$rootScope',
function ($scope, $state, auth, $location, $window, $rootScope){
  $scope.user = {};
  $scope.organization = { permissions: 'Organization' };


  // $scope.register = function(user){
  //   if($state.is("registerUser")){
  //     auth.register($scope.user).then(function (data){
  //       $state.go('home');
  //     });
  //   } else if ($state.is("registerOrg")) {
  //     auth.register($scope.organization).then(function (data){
  //       $state.go('home');
  //     });
  //   }
  // };
  $scope.register = function(user){
    if($state.is("registerUser")){
      auth.register($scope.user).then(function (data){
        console.log('Developer');
        $window.location.href = '/user';
      });
    } else if ($state.is("registerOrg")) {
      auth.register($scope.organization).then(function (data){
        console.log('Organization');
        $window.location.href = '/contributor';
      });
    }
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).then(function (data) {
        if (!data.message) {
          console.log('PERMISSIONS: ', auth.getPermissions());
          if (auth.isAdmin()) {
            console.log('ADMIN');
            $window.location.href = '/admin';
          } else if (auth.isOrganization()) {
            console.log('Organization');
            $window.location.href = '/organization';
          } else {
            console.log('USER');
            $window.location.href="/user";
          }
        } else {
          $scope.error = data;
          $log.error('error', $scope.error);
        }
    });
  };
  // $scope.logIn = function(){
  //   auth.logIn($scope.user).error(function(error){
  //     $scope.error = error;
  //   }).then(function(){
  //     $state.go('home');
  //   });
  // };
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);