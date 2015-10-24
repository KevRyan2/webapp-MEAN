var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var mongoose = require('mongoose');
var passport = require('passport');
var Project = mongoose.model('Project');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');


// API controllers 
var 
  authentication  = require('../controllers/authentication'),
  projects           = require('../controllers/projects');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// ----------------------------------------- PROJECTS  -------------------------------------------------//

router.get('/projects', projects.getProjects );
router.post('/projects', auth, projects.createProject );
router.param('project', projects.projectById );
router.get('/projects/:project', projects.getProjectById );



// ----------------------------------------- AUTHENTICATION  -------------------------------------------------//

router.post('/register', authentication.processRegistration );
router.post('/login', authentication.processLogin );


module.exports = router;
