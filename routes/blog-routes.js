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
  let id = req.user.id
    User.findByIdAndUpdate(id,{
      $push: {
        blogPosts: {
          allowComments: req.body.allowComments,
          title: req.body.title,
          body: req.body.body
        } }
        }, {
          upsert:true
        }, (err, data) => {
          if (err) {
            res.send('error posting a new post');
          } else {
            console.log('in redirect');
            //res.redirect('/blogs/' + req.user.username);
            res.send(data);
          }
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
    userFound.update().then((record)=> {
      console.log('comment added');
      res.render('post', {post: blogPost, username: userFound.username, user: req.user});
    })
  })
})


// router.post('/:user/:postId', authCheck, urlencodedParser, (req, res) => {
//   User.findOne({username: req.params.user}).then((userFound) => {
//     User.findByIdAndUpdate(userFound._id,{
//       $push: {
//         comments: {
//           author: req.user.username,
//           body: req.body.body
//         } }
//         }, {
//           upsert:true
//         }, (err, data) => {
//           if (err) {
//             res.send('error posting a new comment');
//           } else {
//             console.log('in redirect');
//             res.redirect('/');
//             //res.send(data);
//           }
//         })
//   })
// })


module.exports = router;
