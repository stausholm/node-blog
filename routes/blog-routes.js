const router = require('express').Router();
const User = require('../models/user-model');
const bodyParser = require('body-parser');

const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/auth/login');
  } else {
    // if logged in, just go to the next part
    next();
  }
}

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });



// redirect back to home if user just navigates to /blogs
router.get('/', (req, res) => {
  res.redirect('/');
});


router.get('/new-post', authCheck, (req, res) => {
  res.render('new-post', {user: req.user});
});

router.post('/new-post', authCheck, jsonParser, (req, res) => {
  User.findOne({_id: req.user.id}).then((user)=> {
    user.blogPosts.push(req.body);
    user.save().then((record)=> {
      console.log('new post added');
      //res.redirect(req.user.username + '/' + record._id);
      //res.redirect(req.user.username);
      res.send(record);
    })
  })
});


router.get('/:user', (req, res, next) => {
  User.findOne({username: req.params.user}).then((user) => {
    res.render('blog', {user: user});
  }).catch(next);
})

router.get('/:user/:postId', (req, res) => {
  User.findOne({username: req.params.user}).then((userFound) => {
    var blogPost = userFound.blogPosts.id(req.params.postId);
    res.render('post', {post: blogPost, username: userFound.username, user: req.user});
  })
})

router.post('/:user/:postId', authCheck, urlencodedParser, (req, res) => {
  User.findOne({username: req.params.user}).then((userFound) => {
    var blogPost = userFound.blogPosts.id(req.params.postId);
    blogPost.comments.push(req.body);
    userFound.save().then((record)=> {
      console.log('comment added');
      res.render('post', {post: blogPost, username: userFound.username, user: req.user});
    })
  })
})

module.exports = router;
