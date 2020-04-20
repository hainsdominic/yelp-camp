const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const seedDB = require('./seeds');
const passport = require('passport');
const LocalStategy = require('passport-local');
const chalk = require('chalk');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');
//seedDB(); // REMOVE WHEN DEPLOYING

// passport config

app.use(
  require('express-session')({
    secret: 'lol mfuka',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(3000, () => {
  console.log(chalk.bgGreen(chalk.black('YelpCamp Server Started')));
});
