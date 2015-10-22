/* -----------------------------------------------------
   Posts and Comments
   ----------------------------------------------------- */
   
// --- Module Dependencies ---
var mongoose = require('mongoose');

// --- Models ---
var
  Post          = mongoose.model('Post'),
  Comment       = mongoose.model('Comment');


//Operations from Index.js
exports.getPosts = function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
};

exports.createPost = function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
};

exports.getPost = function(req, res, next, id) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
};
/*Get Post/:id*/
//   var query = Post.findById(id);

//   query.exec(function (err, post){
//     if (err) { return next(err); }
//     if (!post) { return next(new Error('can\'t find post')); }

//     req.post = post;
//     return next();
//   });
// });

exports.upvotePost = function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
};

exports.postComment = function(req, res, next) {
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
};

exports.upvoteComment = function (req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(post);
  });
};


exports.getComment = function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
};

