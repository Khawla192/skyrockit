require('dotenv').config();
require('./config/database')

const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// require the middleware!
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const applicationsController = require('./controllers/applications.js');
const authController = require('./controllers/auth.js');

const port = process.env.PORT ? process.env.PORT : '3000';
const path = require('path');

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);

//ROUTES
// PUBLIC ROUTES
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/applications`);
  } else {
    res.render('index.ejs');
  }
});

// PROTECTED ROUTES
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/applications', applicationsController); 

// LISTENER
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
