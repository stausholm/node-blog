const mongoose = require('mongoose');
const User = require('./models/user-model');
mongoose.Promise = global.Promise;

function userCreate(username, password, bio, blogPosts) {
  userDetail = {
    username: username,
    password: password,
    bio: bio,
    blogPosts, blogPosts
  }
  var newUser = new User(userDetail);
  newUser.save().then((data)=>{
    console.log(data.username + " was created");
  });
}

class Post {
  constructor(title, body, allowComments, comments) {
    this.title = title,
    this.body = body,
    this.allowComments = allowComments,
    this.comments = comments
  }

}
class Comment {
  constructor(body, author) {
    this.body = body,
    this.author = author
  }
}



module.exports = function() {
  User.find({}).then((data) => {
    if (data.length == 0) {
      console.log('No users found, populating DB with test users');
      let comment1 = new Comment('This is a nice post!','lisbeth');
      let comment2 = new Comment('Sometimes i dream about cheese','bob');
      let comment3 = new Comment('Where do babies come from?','lisbeth');
      let comment4 = new Comment('i disagree with you','jens');

      let post1 = new Post('post title', 'post body', false, []);
      let post2 = new Post('post title2', 'post body2', true, [comment1]);
      let post3 = new Post('post title3', 'post body3', true, [comment2, comment3, comment4]);
      let bob = userCreate('bob','bob123','i like fishing', [post1, post2]);
      let lisbeth = userCreate('lisbeth','lisbeth123','the water is my main in Overwatch', [post3]);
    }
  })
};
