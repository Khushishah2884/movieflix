const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  password: { type: String, required: true },
  savedMovies: { type: [String], default: [] }, // Array of imdbIDs
  plan: {
    type: { type: String, default: '' },
    price: { type: Number, default: 0 },
    period: { type: String, default: '' }
  },
  devices: { type: Array, default: [] },
  resetToken: { type: String },           // <-- add this
  resetTokenExpiry: { type: Date }        // <-- add this
});

module.exports = mongoose.model('User', userSchema);
