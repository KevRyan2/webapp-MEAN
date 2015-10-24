var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
  creator: {     f_name: String,
                 l_name: String,
                 _id     : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
           },
  body   : String,
  rating : Number,
  created_at : Date,

  status : String, // approved or not

  projects   : { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

mongoose.model('Review', ReviewSchema);
