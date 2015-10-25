app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};
  auth.saveToken = function (token){
    $window.localStorage['flapper-news-token'] = token;
  };

  auth.getToken = function (){
    return $window.localStorage['flapper-news-token'];
  };
  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };
  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };
  // auth.register = function(user){
  //   return $http.post('/api/register', user).success(function(data){
  //     auth.saveToken(data.token);
  //   });
  // };
  auth.registerOrg = function (user) {
    return $http.post('/api/registerOrg', user).success(function(data) {
      console.log('REGISTER DATA: ', data);
      auth.saveToken(data.token);
    }).catch(function(err) {
      return err.data;
    });
  };
  auth.registerUser = function(user){
    return $http.post('/api/registerUser', user).success(function(data){
      console.log('REGISTER DATA: ', data);
      auth.saveToken(data.token);
    });
  };
  auth.logIn = function(user){
    return $http.post('/api/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logOut = function(){
    $window.localStorage.removeItem('flapper-news-token');
  };
  auth.getPermissions = function() {
    var token = auth.getToken();
    var payload = JSON.parse($window.atob(token.split('.')[1]));
    console.log(payload);
    return payload.permissions;
  };
  auth.isOrganization = function(){
      var token = auth.getToken();
      if(token){
       var payload = JSON.parse($window.atob(token.split('.')[1]));
       return (payload.permissions === 'Organization' || payload.permissions === 'Admin');
      } else {
        console.log('missing token');
      }
  };
    auth.header = function() {
    return { headers: { Authorization: 'Bearer ' + auth.getToken() } };
  };


  return auth;
}])

app.factory('projects', ['$http', 'auth', function($http, auth){
  var o = {
    projects: []
  };
  o.getAll = function() {
    return $http.get('/api/projects').success(function(data){
      angular.copy(data, o.projects);
    });
  };
  o.create = function(project) {
    return $http.post('/api/projects', project, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.projects.push(data);
    });
  };
  o.upvote = function(project) {
    return $http.put('/api/projects/' + project._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      project.upvotes += 1;
    });
  };
  o.get = function(id) {
    return $http.get('/api/projects/' + id).then(function(res){
      return res.data;
    });
  };
  o.addComment = function(id, comment) {
    return $http.post('/api/projects/' + id + '/comments', comment, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };
  o.upvoteComment = function(project, comment) {
    return $http.put('/api/projects/' + project._id + '/comments/'+ comment._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      comment.upvotes += 1;
    });
  };
  return o;
}]);