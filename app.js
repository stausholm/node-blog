const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user-model');
const blogRoutes = require('./routes/blog-routes');

const populateDb = require('./populateDb');

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


populateDb();

//set up routes
//app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);


//home route
app.get('/', (req, res) => {
  User.find({}).then((data) => {
    res.render('index', {data: data});
  })
});

app.get('/profile', (req, res) => {
  res.render('profile');
});


//error handling middleware
app.use(function(err, req, res, next) {
  //console.log(err.message);
  res.status(422).render('error',{error: err.message});
});


app.listen(3000, () => {
  console.log('listening on port 3000');
});
