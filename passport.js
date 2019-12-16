const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

var Users = Models.User;
var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;

//HTTP authentication//
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + ' ' + password);
  Users.findOne({Username: username}, (err, user) => {
    if (err) {
      console. log(err);
      return callback(err);
    }
    if (!user) {
      console.log('incorrect username')
      return callback(null, false, {message: 'Incorrect username or password'})
    }
    console.log('finshed');
    return callback(null, user);
  });
}));

//JWT authentication//
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
  .then((user) => {return callback(null, user);})
  .catch((error) => {return callback(error)
  });
}));
