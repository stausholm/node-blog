const mongoose = require('mongoose');
const Schema = mongoose.Schema;



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
  username: String,
  password: String,
  bio: String,
  blogPosts: [postSchema]
});

const User = mongoose.model('user', userSchema);

module.exports = User;
