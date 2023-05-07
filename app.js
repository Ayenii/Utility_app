//requirement for instanciating .env variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//Base dependencies
const express = require('express');
const session = require('express-session');
var passport = require('passport');
var routes = require('./routes');



//package documentation
const MongoStore = require("connect-mongo");

//Instantiate express app
var app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

let store = new MongoStore({
  mongoUrl: process.env.DATABASE_URL,
  collection: "sessions"
});

//create a session object and store in session mongo session collection
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store, 
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

require('./config/passport-config');

app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('static'));
app.set('view engine', 'ejs')

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


