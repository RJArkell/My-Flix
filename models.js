const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Schema for genres//
var genreSchema = mongoose.Schema({
  _id: String,
  Name: { type: String, required: true },
  Description: { type: String, required: true },
});

//Schema for directors//
var directorSchema = mongoose.Schema({
  _id: String,
  Name: { type: String, required: true },
  Biography: { type: String, required: true },
  Born: String,
  Died: String
});

//Schema for movies//
var movieSchema = mongoose.Schema({
  _id: String,
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
  Director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

//Autopopulate the genre and director fields for movies//
var autoPopulateMovies = function (next) {
  this.populate('Genre');
  this.populate('Director');
  next();
};

movieSchema.
  pre('find', autoPopulateMovies).
  pre('findOne', autoPopulateMovies);

//Schema for users//
var userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.String, ref: 'Movie' }]
});

//Bcrypt password encryption//
userSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

//Models for all schemas//
var Genre = mongoose.model('Genre', genreSchema);
var Director = mongoose.model('Director', directorSchema);
var Movie = mongoose.model('Movie', movieSchema);
var User = mongoose.model('User', userSchema);

//Export all models//
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
