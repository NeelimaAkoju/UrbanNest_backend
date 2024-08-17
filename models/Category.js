const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  creationAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model('Category', categorySchema);