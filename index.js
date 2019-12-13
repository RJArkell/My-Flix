const express = require('express'),
  morgan = require('morgan'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  Movies = Models.Movie,
  Users = Models.User;

//Connect Mongoose to database//
mongoose.connect('mongodb://localhost:27017/EdgeOfUmbra', {useNewUrlParser: true});
//Body-parser//
app.use(bodyParser.json());
//File retrieving from public folder//
app.use(express.static('public'));
//Info logging//
app.use(morgan('common'));

//Get list of movies//
app.get('/movies', function(req, res) {
  Movies.find()
  .then(function(movies) {res.status(201).json(movies)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get movie info//
app.get('/movies/:Title', function(req, res) {
  Movies.findOne({Title: req.params.Title})
  .then(function(movie) {res.json(movie)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get list of users//
app.get('/users', function(req, res) {
  Users.find()
  .then(function(users) {res.status(201).json(users)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get a user by username//
app.get('/users/:Username', function(req, res) {
  Users.findOne({Username: req.params.Username})
  .then(function(user) {res.json(user)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get list of genres//
app.get('/genres', (req, res) => {
  res.json(Genres)
});
//Get list of directors//
app.get('/directors', (req, res) => {
  res.json(Directors)
});
//Get genre info//
app.get('/genres/:name', (req, res) => {
  res.json(Genres.find((genre) =>
  {return genre.name === req.params.name}));
});
//Get director info//
app.get('/directors/:name', (req, res) => {
  res.json(Directors.find((director) =>
  {return director.name === req.params.name}));
});

//Create user//
app.post('/users', function(req, res) {
  Users.findOne({Username: req.body.Username})
  .then(function(user) {
    if (user) {
      return res.status(400).send("Username " + req.body.Username + " is already in use");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
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
app.put('/users/:Username', function(req, res) {
  Users.findOneAndUpdate({Username: req.params.Username}, {$set : {
    Username : req.body.Username,
    Password : req.body.Password,
    Email : req.body.Email,
    Birthday : req.body.Birthday
  }},
  {new : true},
  .then(function(updatedUser) {res.json(updatedUser)})
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});
//Delete user by username//
app.delete('/users/:Username', function(req, res) {
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
app.post('/users/:Username/Movies/:MovieID', function(req, res) {
  Users.findOneAndUpdate({Username : req.params.Username}, {
    $push : {FavoriteMovies : req.params.MovieID}
  },
  { new : true },
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
app.delete('/users/:Username/favorites/:Title', function(req, res) {
  Users.findOneAndRemove({Username: req.params.Username})
  .then(function(favorite) {
    if (!favorite) {res.status(400).send("User " + req.params.Username + " was not found");
    } else {res.status(200).send("User " + req.params.Username + " was deleted.");}
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Error catching//
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080);
