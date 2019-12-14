const mongoose = require('mongoose');

//
var genreSchema = mongoose.Schema({
  _id: String,
  Name: {type: String, required: true},
  Description: {type: String, required: true},
});

//
var directorSchema = mongoose.Schema({
  _id: String,
  Name: {type: String, required: true},
  Biography: {type: String, required: true},
  Born: String,
  Died: String
});

//
var movieSchema = mongoose.Schema({
  _id: String,
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
  Director: [{type: mongoose.Schema.Types.ObjectId, ref: 'Director'}],
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

var autoPopulateGenre = function(next) {
  this.populate('Genre');
  next();
};

movieSchema.
  pre('find', autoPopulateGenre).
  pre('findOne', autoPopulateGenre);

var autoPopulateDirector = function(next) {
  this.populate('Director');
  next();
};

movieSchema.
  pre('find', autoPopulateDirector).
  pre('findOne', autoPopulateDirector);

//
var userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{type: mongoose.Schema.Types.String, ref: 'Movie'}]
});

//
var Genre = mongoose.model('Genre', genreSchema);
var Director = mongoose.model('Director', directorSchema);
var Movie = mongoose.model('Movie', movieSchema);
var User = mongoose.model('User', userSchema);

//
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
