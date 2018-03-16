const router = require('express').Router();
const User = require('../models/user-model');

router.get('/', (req, res) => {
  res.redirect('/');
});


router.get('/new-post', (req, res) => {
  res.render('new-post');
});


router.get('/:user', (req, res, next) => {
  User.findOne({username: req.params.user}).then((user) => {
    res.render('blog', {user: user});
  }).catch(next);
})

router.get('/:user/:postId', (req, res) => {
  User.findOne({username: req.params.user}).then((user) => {
    var blogPost = user.blogPosts.id(req.params.postId);
    res.render('post', {post: blogPost, username: user.username});
  })
})

module.exports = router;
