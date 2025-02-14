const express = require('express'),
  morgan = require('morgan'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  Models = require('./models.js'),
  passport = require('passport'),
  path = require("path"),
  { check, validationResult } = require('express-validator');
require('./passport');

//Imported models//
const Movies = Models.Movie,
  Users = Models.User,
  Genres = Models.Genre,
  Directors = Models.Director;

/** 
 * Connect Mongoose to database
*/
//mongoose.connect('mongodb://localhost:27017/EdgeOfUmbra', {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://Admin:reaver3@arnketel-69akm.azure.mongodb.net/EdgeOfUmbra?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
//File retrieving from public folder//
app.use(express.static('public'));
app.use("/client", express.static(path.join(__dirname, "client", "dist")));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
//Info logging//
app.use(morgan('common'));
//Body-parser//
app.use(bodyParser.json());
//Cross-Origin Resource Sharing//
app.use(cors());
//Authentication//
var auth = require('./auth')(app);

app.get("/", (req, res) => {
  res.send("Edge of Umbra: A database of Science-Fiction, Horror, and Thriller movies");
});
/**
  * Get list of movies
  * @function GET /movies
  */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => { res.status(201).json(movies) })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/**
* Get movie info
* @function GET /movies/:Title
*/
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => { res.json(movie) })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/**
  * Get list of genres
  * @function GET /genres
  */
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then((genres) => { res.status(201).json(genres) })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/**
  * Get genre info
  * @function GET /genres/:Name
  */
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => { res.json(genre) })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/**
  * Get list of directors
  * @function GET /directors
  */
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
    .then((directors) => { res.status(201).json(directors) })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/**
  * Get director info
  * @function GET /directors/:Name
  */
app.get('/directors/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((director) => { res.json(director) })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/**
  * Get list of users
  * @function GET /users
  */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => { res.status(201).json(users) })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/**
  * Get user profile
  * @function GET /users/:Username
  */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => { res.json(user) })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
  * Create new user profile
  * @function POST /users
  */
app.post('/users', [
  check('Username', "Username is required").isLength({ min: 5 }),
  check('Username', "Username contains non-alphanumeric characters - not allowed.").isAlphanumeric(),
  check('Password', "Password is required").not().isEmpty(),
  check('Email', "Email does not appear to be valid").isEmail()],
  (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(422).json({ errors: errors.array() }); }
    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send("Username " + req.body.Username + " is already in use");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => { res.status(201).json(user) })
            .catch((err) => {
              console.error(err);
              res.status(500).send("Error: " + err);
            });
        }
      }).catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });
/**
  * Edit user info
  * @function PUT /users/:Username
  */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
  check('Username', "Username is required").isLength({ min: 5 }),
  check('Username', "Username contains non-alphanumeric characters - not allowed.").isAlphanumeric(),
  check('Password', "Password is required").not().isEmpty(),
  check('Email', "Email does not appear to be valid").isEmail()],
  (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(422).json({ errors: errors.array() }); }
    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set: {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser)
        }
      })
  });
/**
  * Delete user profile
  * @function DELETE /users/:username
  */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send("User " + req.params.Username + " was not found");
      } else { res.status(200).send("User " + req.params.Username + " was deleted."); }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
  * Add movie to favorites list
  * @function POST /users/:Username/FavoriteMovies/:MovieID
  */
app.post('/users/:Username/FavoriteMovies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});
/**
  * Delete movie from favorites list
  * @function DELETE /users/:username/FavoriteMovies/:MovieID
  */
app.delete('/users/:Username/FavoriteMovies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

//Error catching//
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port " + port);
});
