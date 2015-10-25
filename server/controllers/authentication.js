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
  // } else if (req.body.username !== req.body.repeat_username) {
  //   return res.status(400).json({message: 'Emails do not match'});
  // } else if (req.body.password !== req.body.repeat_password) {
  //   return res.status(400).json({message: 'Passwords do not match'});
  }

  var user = new User();
  if (req.body.permissions === 'Organization') { user.permissions = 'Organization'; }
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.generateUserToken();

  user.save(function (err){
    if (err) { console.log('USER SAVE ERROR:', err); return next(err); }

    return res.json({token: user.generateJWT()})
  });
};

// exports.processUserRegistration = function(req, res, next){
//   if(!req.body.username || !req.body.password){
//     return res.status(400).json({message: 'Please fill out all fields'});
//   // } else if (req.body.username !== req.body.repeat_username) {
//   //   return res.status(400).json({message: 'Emails do not match'});
//   // } else if (req.body.password !== req.body.repeat_password) {
//   //   return res.status(400).json({message: 'Passwords do not match'});
//   }

//   var user = new User();

//   user.username = req.body.username;
//   user.setPassword(req.body.password);
//   user.generateUserToken();

//   user.save(function (err){
//     if (err) { logger.error('USER SAVE ERROR:',err); return next(err); }

//     return res.json({token: user.generateJWT()})
//   });
// };

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
