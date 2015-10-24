var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var permissionsTypes = ['User', 'Organization', 'Admin'];

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true},
  f_name: String,
  l_name: String,
  hash: String,
  salt: String,
  email_listing: Boolean,

  confirmation: Boolean,
  created: { type: Date, default: Date.now },
  phone_number: Number,
  relevant_skills: [ { type: String } ],
  project_interests: String,
  education: String,
  background: String,
  affiliations: String,
  user_token: { type: String, lowercase: true, unique: true },
  permissions: { type: String, default: 'User', enum: permissionsTypes },
  avatar_url: String,
  logo_url: String,
  cover_photo_url: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
  dob: String,
  website_link: String,

  facebook: {
    id: String,
    token: String,
    email: String,
    first_name: String,
    last_name: String
  },
  google: {
    f_name: String,
    l_name: String,
    email: String,
    image_url: String,
    access_token: String,
    refresh_token: String,
    token_type: String,
    exp_date: Date
  },

  assets: {
    photos: [ String ],
    videos: [ String ],
    cover_photo: String,
  },  
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    f_name: this.f_name,
    l_name: this.l_name,
    permissions: this.permissions,
    avatar_url: this.avatar_url,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

mongoose.model('User', UserSchema);