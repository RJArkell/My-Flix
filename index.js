const express = require('express'),
  morgan = require('morgan'),
  app = express();

//Movie list//
  let topMovies = [{
      title : 'Alien',
      director : 'Ridley Scott',
      year: '1979'
  },
  {
      title : 'Predator',
      director : 'John McTiernan',
      year: '1987'
  },
  {
      title : 'Se7en',
      director : 'David Fincher',
      year: '1995'
  },
  {
      title : 'Coherence',
      director : 'James Ward Byrkit',
      year: '2013'
  },
  {
      title : 'Mad Max: Fury Road',
      director : 'George Miller',
      year: '2015'
  },
  {
      title : '28 Days Later',
      director : 'Danny Boyle',
      year: '2002'
  },
  {
      title : 'The Thing',
      director : 'John Carpenter',
      year: '1982'
  },
  {
      title : 'The Raid',
      director : 'Gareth Evans',
      year: '2011'
  },
  {
      title : 'Drive',
      director : 'Nicolas Winding Refn',
      year: '2011'
  },
  {
      title : 'Bone Tomahawk',
      director : 'S. Craig Zahler',
      year: '2015'
  }
  ]

//File retrieving from public folder//
app.use(express.static('public'));

//Info logging//
app.use(morgan('common'));

//Get requests//
app.get('/', function(req, res) {
  res.send('')
});
app.get('/movies', function(req, res) {
  res.json(topMovies)
});

//Error catching//
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080);
