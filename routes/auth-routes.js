const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// auth login
router.get('/login', (req, res) => {
  res.render('login', {user: req.user});
});

// auth login
router.post('/login', urlencodedParser, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));





// auth login
router.get('/register', (req, res) => {
  res.render('register', {user: req.user || null, err: ''});
});

// auth login
router.post('/register', urlencodedParser, function(req, res) {
  User.findOne({username : req.body.username}).then((foundUser) => {
    if (foundUser) {
      console.log('sorry, username is already in use');
      res.render('register', {user: req.user || null, err: 'username taken'});
    } else {
      bcrypt.hash(req.body.password, 10).then((hash) => {
        User.create({
          username: req.body.username,
          password: hash
        }).then(function(data) {
          //data.encryptPW(data.password);
          console.log('new user created: ' + data);
          req.login(data, function(err) {
            if (err) { return next(err); }
            return res.redirect('/profile');
          });
        })

      })


    }
  })
});





// auth logout
router.get('/logout', (req, res) => {
  // handle with passport
  //res.send('logging out');
  req.logout(); //this destroys the session cookie
  res.redirect('/');
});

module.exports = router;
