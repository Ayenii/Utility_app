if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')

const initializePassport = require('./passport-config')
//connect to mongodb database
// initialize port
const port = process.env.PORT || 2000;
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => //connect to port only if database connection is established
app.listen(port, () => console.log(`Listening on port ${port}...`)))
.catch((err) => console.log(err));
const Account = require('./models/account')
//Setup account authentication
initializePassport(
  passport,
  email => Account.find(account => Account.email === email),
  id => Account.find(user => Account.id === id)
)
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



app.get('/', checkAuthenticated, (req, res) => {
  res.render('frame.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const account = new Account({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}






