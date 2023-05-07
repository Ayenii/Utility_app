/* eslint-disable no-multi-str */
const router = require('express').Router();
const passport = require('passport');
const connection = require('../config/database-config');
const { isAuth } = require('./authMiddleware');
const genPassword = require('../lib/passwordUtils').genPassword;
const Account = connection.models.Account;

/**
 * -------------- POST ROUTES ----------------
 */

 // TODO
 router.post('/login',passport.authenticate('local', {failureRedirect: '/login-failure' , successRedirect:'/login-success'}));

 // TODO
 router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password)
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newAccount = new Account({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      hash: hash,
      salt: salt,
      admin: true
    });
    newAccount.save()
    .then((user) =>{
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/register')
    });
    res.redirect('/login')

 });


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {

    res.render('frame.ejs')

});

// When you visit http://localhost:2000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
   
    res.render('login.ejs')

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    res.render('register.ejs')

});

router.get('/protected-route', isAuth, (req, res, next) => {
  res.send('You made it to the route');
});

router.get('/list', (req,res,next) => {
  res.render('list.ejs')
})

// Visiting this route logs the user out
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/protected-route');
    });
  });

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;

