/* -----------------------------------------------------
   Projects and Comments
   ----------------------------------------------------- */
   
// --- Module Dependencies ---
var mongoose = require('mongoose');

// --- Models ---
var
  Project           = mongoose.model('Project'),
  Comment           = mongoose.model('Comment');


//Operations from Index.js
exports.getProjects = function(req, res, next) {
  Project.find(function(err, projects){
    if(err){ return next(err); }

    res.json(projects);
  });
};

exports.createProject = function(req, res, next) {
  var project = new Project(req.body);
  project.author = req.payload.username;

  project.save(function(err, project){
    if(err){ return next(err); }

    res.json(project);
  });
};

exports.getProject = function(req, res, next, id) {
  req.project.populate('comments', function(err, project) {
    if (err) { return next(err); }

    res.json(project);
  });
};

exports.projectById = function (req, res, next, id) {
  var query = Project.findById(id);

  query.exec(function (err, project){
    if (err) { return next(err); }
    if (!project) { return next(new Error('can\'t find project')); }

    req.project = project;
    return next();
  });
};

exports.getProjectById = function(req, res, next) {
  req.project.populate('comments', function(err, project) {
    if (err) { return next(err); }

    res.json(project);
  });
};

exports.upvoteProject = function(req, res, next) {
  req.project.upvote(function(err, project){
    if (err) { return next(err); }

    res.json(project);
  });
};

exports.projectComment = function(req, res, next) {
  var comment = new Comment(req.body);
  comment.project = req.project;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.project.comments.push(comment);
    req.project.save(function(err, project) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
};

exports.upvoteComment = function (req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(project);
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

