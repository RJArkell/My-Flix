const express = require('express'),
  morgan = require('morgan'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

//List of movies//
let Movies = [{
    title: 'Alien',
    director: 'Ridley Scott',
    year: '1979',
    genre: 'Science-Fiction'
  },
  {
    title: 'Predator',
    director: 'John McTiernan',
    year: '1987',
    genre: 'Science-Fiction'
  },
  {
    title: 'Se7en',
    director: 'David Fincher',
    year: '1995',
    genre: 'Thriller'
  },
  {
    title: 'Coherence',
    director: 'James Ward Byrkit',
    year: '2013',
    genre: 'Science-Fiction'
  },
  {
    title: 'Mad Max: Fury Road',
    director: 'George Miller',
    year: '2015',
    genre: 'Post-Apocalyptic'
  },
  {
    title: '28 Days Later',
    director: 'Danny Boyle',
    year: '2002',
    genre: 'Post-Apocalyptic'
  },
  {
    title: 'The Thing',
    director: 'John Carpenter',
    year: '1982',
    genre: 'Science-Fiction'
  },
  {
    title: 'The Raid',
    director: 'Gareth Evans',
    year: '2011',
    genre: 'Action'
  },
  {
    title: 'Drive',
    director: 'Nicolas Winding Refn',
    year: '2011',
    genre: 'Thriller'
  },
  {
    title: 'Bone Tomahawk',
    director: 'S. Craig Zahler',
    year: '2015',
    genre: 'Horror'
  }
]

//List of directors//
let Directors = [{
    name: 'Ridley Scott',
    born: '1937'
  },
  {
    name: 'John McTiernan',
    born: '1951'
  },
  {
    name: 'David Fincher',
    born: '1962'
  },
  {
    name: 'James Ward Byrkit',
    born: '?'
  },
  {
    name: 'George Miller',
    born: '1945'
  },
  {
    name: 'Danny Boyle',
    born: '1956'
  },
  {
    name: 'John Carpenter',
    born: '1948'
  },
  {
    name: 'Gareth Evans',
    born: '1980'
  },
  {
    name: 'Nicolas Winding Refn',
    born: '1970'
  },
  {
    name: 'S. Craig Zahler',
    born: '1973'
  }
]

let Genres = [{
    name: 'Horror',
    description: 'Films that seeks to elicit fear for entertainment purposes'
  }
]

let Users = [{
    id: '1',
    username: 'User1',
  }
]

let Favorites = [{
    title: 'The Thing',
    director: 'John Carpenter',
    year: '1982',
    genre: 'Science-Fiction'
  }
]

//Body-parser//
app.use(bodyParser.json());
//File retrieving from public folder//
app.use(express.static('public'));
//Info logging//
app.use(morgan('common'));

//Get list of movies//
app.get('/movies', (req, res) => {
  res.json(Movies)
});
//Get list of genres//
app.get('/genres', (req, res) => {
  res.json(Genres)
});
//Get list of directors//
app.get('/directors', (req, res) => {
  res.json(Directors)
});
//Get movie info//
app.get('/movies/:title', (req, res) => {
  res.json(Movies.find((movie) =>
  {return movie.title === req.params.title}));
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
app.post('/users', (req, res) => {
  let newUser = req.body;
  if (!newUser.username) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    Users.push(newUser);
    res.status(201).send(newUser);
  }
});
//Update user info//
app.put('/users/:username', (req, res) => {
    res.status(201).send('User information updated');
});
//Delete user//
app.delete('/users/:id', (req, res) => {
  let user = Users.find((user) => { return user.id === req.params.id});
  if (user) {
    Users = Users.filter(function(obj) { return obj.id !== req.params.id});
    res.status(201).send('User ID:'+ req.params.id + ' has been deleted.')
  }
});

//Add favorite movie//
app.post('/users/:username/favorites', (req, res) => {
  let newFavorite = req.body;
  if (!newFavorite.title) {
    const message = 'Missing movie title in request body';
    res.status(400).send(message);
  } else {
    newFavorite.id = uuid.v4();
    Favorites.push(newFavorite);
    res.status(201).send(newFavorite);
  }
});
//Remove favorite movie//
app.delete('/users/:username/favorites/:title', (req, res) => {
  let favorite = Favorites.find((favorite) =>
    {return favorite.title === req.params.title});
  if (favorite) {
    Favorites.filter(function(obj) {return obj.title !== req.params.title});
    res.status(201).send(req.params.title + ' was removed from favorites.');
  }
});

//Error catching//
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080);
