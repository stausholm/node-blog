const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user-model');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth-routes');
const blogRoutes = require('./routes/blog-routes');

const cookieSession = require('cookie-session');

const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


//const populateDb = require('./populateDb');

const app = express();

//set up view engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('public'));


//connect to mongodb
mongoose.connect("mongodb://localhost/node-blog-db");
mongoose.Promise = global.Promise;
mongoose.connection.once('open', function(){
    console.log('connected to DB');
}).on('error', function(error) {
  console.log('connection error:', error);
});


//populateDb();



app.use(cookieSession({
  maxAge: 24*60*60*1000, // 1 day //how long you want the cookie to last. number is in milliseconds
  keys: ["aSecretKey"] // used to encrypt the id cookie
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());








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





//set up routes
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);


//home route
app.get('/', (req, res) => {
  User.find({}).then((data) => {
    res.render('index', {data: data, user: req.user});
  })
});

app.get('/profile', authCheck, (req, res) => {
  res.render('profile', {user: req.user});
});
app.post('/profile', authCheck, jsonParser, (req, res) => {
  User.findByIdAndUpdate({_id: req.user.id}, req.body).then((updatedUser) => {
    console.log('updated user');
    res.send(updatedUser);
  });
});


//error handling middleware
app.use(function(err, req, res, next) {
  //console.log(err.message);
  res.status(422).render('error',{error: err.message, user: req.user});
});


app.listen(3000, () => {
  console.log('listening on port 3000');
});
