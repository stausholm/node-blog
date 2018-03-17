const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const commentSchema = new Schema({
  body: String,
  author: String,
  posted: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new Schema({
  title: String,
  body: String,
  posted: {
    type: Date,
    default: Date.now
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  comments: [commentSchema]
});

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: 'Username is required',
    trim: true
    //match: [/[a-zA-Z0-9]/g, 'Only letters and numbers allowed']
  },
  password: {
    type: String,
    required: 'Password is required'
  },
  bio: {
    type: String,
    maxLength: 140,
    default: 'Welcome to my awesome blog!'
  },
  blogPosts: [postSchema]
});


//hashing a password before saving it to the database
// userSchema.pre('save', function (next) {
//   var user = this;
//   bcrypt.hash(user.password, 10, function (err, hash) {
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   })
// });

userSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};


const User = mongoose.model('user', userSchema);


module.exports = User;
