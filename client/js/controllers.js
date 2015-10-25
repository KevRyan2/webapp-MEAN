

app.controller('MainCtrl', [
'$scope',
'projects',
'auth',
function($scope, projects, auth){
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
function($scope, $state, auth){
  // $scope.user = {};
  $scope.organization = { permissions: 'Organization' };

  // $scope.register = function(){
  //   auth.register($scope.user).error(function(error){
  //     $scope.error = error;
  //   }).then(function(){
  //     $state.go('home');
  //   });
  // };
  $scope.registerUser = function(){
    auth.register($scope.user).error(function (error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.registerOrg = function() {
    auth.register($scope.organization).error(function (error) {
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);