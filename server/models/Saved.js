const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  imdbID: { type: String, required: true },
  movieTitle: { type: String },
  moviePoster: { type: String },
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Saved', savedSchema);
