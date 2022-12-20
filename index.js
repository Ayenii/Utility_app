if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('./passport-config')(passport);
//connect to mongodb database
// initialize port
const port = process.env.PORT || 2000;
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => //connect to port only if database connection is established
app.listen(port, () => console.log(`Connected to Database\nListening on port ${port}...`)))
.catch((err) => console.log(err));
const Account = require('./models/Account')
//Setup account authentication

const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
app.use('/static', express.static('static'));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(express.json());
const users = []



app.get('/', (req, res) => {
  res.render('frame.ejs')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post(
  '/login',
  passport.authenticate("local-login", { session: false , successRedirect: '/',
  failureRedirect: '/login' }),
  (req, res, next) => {
    // login
    jwt.sign({account: req.account}, process.env.SESSION_SECRET, {expiresIn: '1h'}, (err, token) => {
      if(err) {
        return res.json({
          message: "Failed to login",
          token: null,
        });
      }
      res.json({
        token
      });
    })
  }
  );

  app.get(
     "/account/protected",
     passport.authenticate("jwt", { session: false }),
     (req, res, next) => {
       res.json({account: req.account});
     }
    );  

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', async (req, res) => {
  try {
    const account = new Account({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    account.save()
    .then((result) =>{
      res.send(result)
    })
    .catch((err) => {
      console.log(err);
    });
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})