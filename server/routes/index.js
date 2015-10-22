var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var mongoose = require('mongoose');
var passport = require('passport');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');


// API controllers 
var 
  authentication  = require('../controllers/authentication'),
  posts           = require('../controllers/posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// ----------------------------------------- POSTS  -------------------------------------------------//

router.get('/posts', posts.getPosts );
router.post('/posts', auth, posts.createPost );

/*Load Post by ID*/
router.param('post', function (req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

/*Get Post/:id*/
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});


// ----------------------------------------- AUTHENTICATION  -------------------------------------------------//

router.post('/register', authentication.processRegistration );
router.post('/login', authentication.processLogin );


module.exports = router;
