const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const connection = require('./database-config');
const Account = connection.models.Account;
const validPassword = require('../lib/passwordUtils').validPassword;

const verify = (username, password, done) => {
  Account.findOne({username: username})
    .then((user) => {
      if(!user) { return done(null,false)}

      const isValid = validPassword(password, user.hash, user.salt);

      if(isValid) {
        return done(null,user);
      }
      else{
        return done(null,false);
      }
    })
    .catch((err) => {
      done(err);
    });
}

const strategy = new LocalStrategy(verify)
passport.use(strategy)

passport.serializeUser((user,done) => {
  done(null,user.id);
});

passport.deserializeUser((userId,done) => {
  Account.findById(userId)
      .then((user) => {
          done(null,user);
      })
      .catch((err) => {
          done(err);
      });
})

