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

/* GET posts */
router.get('/posts', posts.getPosts );

/*POST posts*/
router.post('/posts', auth, posts.createPost );

/*Load Post by ID*/
router.param('post', function(req, res, next, id) {
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

/*Put Upvote to Post*/
router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

/*Put Comment to Post*/
router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

/*Put Upvote to Comment*/
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(post);
  });
});

/*Load Comment by :id*/
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

// ----------------------------------------- AUTHENTICATION  -------------------------------------------------//
/*User Register*/
router.post('/register', authentication.processRegistration );
/*User Login*/
router.post('/login', authentication.processLogin );


module.exports = router;
