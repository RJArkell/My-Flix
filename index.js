const express = require('express'),
  morgan = require('morgan'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  Models = require('./models.js'),
  Movies = Models.Movie,
  Users = Models.User,
  Genres = Models.Genre,
  Directors = Models.Director,
  passport = require('passport');
  require('./passport');

//Connect Mongoose to database//
mongoose.connect('mongodb://localhost:27017/EdgeOfUmbra', {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});
//Body-parser//
app.use(bodyParser.json());
//File retrieving from public folder//
app.use(express.static('public'));
//Info logging//
app.use(morgan('common'));
//Authentication//
var auth = require('./auth')(app);

//Cross-Origin Resource Sharing//
var allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

//Get list of movies//
app.get('/movies', passport.authenticate('jwt', {session: false}), function(req, res) {
  Movies.find()
  .then(function(movies) {res.status(201).json(movies)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get movie info//
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), function(req, res) {
  Movies.findOne({Title: req.params.Title})
  .then(function(movie) {res.json(movie)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get list of genres//
app.get('/genres', passport.authenticate('jwt', {session: false}), function(req, res) {
  Genres.find()
  .then(function(genres) {res.status(201).json(genres)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get genre info by name//
app.get('/genres/:Name', passport.authenticate('jwt', {session: false}), function(req, res) {
  Genres.findOne({Name: req.params.Name})
  .then(function(genre) {res.json(genre)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get list of directors//
app.get('/directors', passport.authenticate('jwt', {session: false}), function(req, res) {
  Directors.find()
  .then(function(directors) {res.status(201).json(directors)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get director by name//
app.get('/directors/:Name', passport.authenticate('jwt', {session: false}), function(req, res) {
  Directors.findOne({Name: req.params.Name})
  .then(function(director) {res.json(director)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get list of users//
app.get('/users', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.find()
  .then(function(users) {res.status(201).json(users)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get user info by username//
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.findOne({Username: req.params.Username})
  .then(function(user) {res.json(user)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Create user//
app.post('/users', function(req, res) {
  var hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username})
  .then(function(user) {
    if (user) {
      return res.status(400).send("Username " + req.body.Username + " is already in use");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) {res.status(201).json(user)})
      .catch(function(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      })
    }
  }).catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Update user info//
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.findOneAndUpdate({Username: req.params.Username}, {$set : {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }},
  {new: true},
  function(err, updatedUser) {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " +err);
    } else {
      res.json(updatedUser)
    }
  })
});
//Delete user by username//
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.findOneAndRemove({Username: req.params.Username})
  .then(function(user) {
    if (!user) {res.status(400).send("User " + req.params.Username + " was not found");
    } else {res.status(200).send("User " + req.params.Username + " was deleted.");}
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Add favorite movie//
app.post('/users/:Username/FavoriteMovies/:MovieID', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $push: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});
//Remove favorite movie//
app.delete('/users/:Username/FavoriteMovies/:MovieID', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

//Error catching//
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080);
