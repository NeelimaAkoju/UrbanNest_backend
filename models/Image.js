const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  productId: Number,
  url: String,
});

module.exports = mongoose.model('Image', imageSchema);