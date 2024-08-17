const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  creationAt: Date,
  updatedAt: Date,
  categoryId: Number,
});

module.exports = mongoose.model('Product', productSchema);