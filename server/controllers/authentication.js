/* -----------------------------------------------------
   AUTH
   ----------------------------------------------------- */
//env
// var config = require('./../../env.json')[process.env.NODE_ENV || 'development'];

// Module Dependencies
var 
	mongoose = require('mongoose'),
	nodemailer = require('nodemailer'),
  passport = require('passport'),
	User = mongoose.model('User');
	// transporter = nodemailer.createTransport({
 //    service: 'Mandrill',
 //    host: 'smtp.mandrillapp.com',
 //    port: 587,
 //    auth: {
 //        user: config['MANDRILL_USER'],
 //        pass: config['MANDRILL_PASSWORD']
 //    }});

// --- Models --- //
var
  User          = mongoose.model('User');

//Operations
exports.processRegistration = function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
};

exports.processLogin = function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
};
