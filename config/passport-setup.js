const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user-model');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  //all we want to serialize and send into a cookie, is the _id
  console.log('inside serializeUser');
  done(null, user.id); //the first parameter is the error. id is the mongodb _id
});


passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    console.log('inside deserializeUser');
    done(null, user); //pass the user found onto the next stage
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('inside LocalStrategy');
    User.findOne({ username: username }, function(err, user) {
      console.log('inside LocalStrategy callback');
      if (err) { console.log(err); return done(err); }
      if (!user) {
        console.log('incorrect username');
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        console.log('incorrect password');
        return done(null, false, { message: 'Incorrect password.' });
      }
      // bcrypt.compare(password, user.password, function(err, isMatch) {
      //   if (err) throw err;
      //   if (!isMatch) {
      //     console.log('incorrect password');
      //  		return done(null, false, {message: 'Invalid password'});
      //   }
      //   console.log(user);
      //   return done(null, user);
      // })
      return done(null, user);
    });
  }
));
