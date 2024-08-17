const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Image = require('../models/Image');
const sorting = require('../middleware/sorting');
const paginatedResults = require('../middleware/pagination');

// Get all products
router.get('/', paginatedResults(Product), sorting, async (req, res) => {
  try {
    const products = await Product.find().sort(req.sorting).lean().exec();
    
    // Fetch images for all products
    const productIds = products.map(product => product.id);
    const images = await Image.find({ productId: { $in: productIds } }).lean().exec();

    // Create a map of productId to images
    const imageMap = images.reduce((acc, img) => {
      if (!acc[img.productId]) {
        acc[img.productId] = [];
      }
      acc[img.productId].push(img.url);
      return acc;
    }, {});

    // Add images to each product
    const productsWithImages = products.map(product => ({
      ...product,
      images: imageMap[product.id] || []
    }));

    res.json({ ...res.paginatedResults, results: productsWithImages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean().exec();
    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const category = await Category.findOne({ id: product.categoryId }).lean().exec();
    const images = await Image.find({ productId: product.id }).lean().exec();
    res.json({ 
      ...product, 
      category, 
      images: images.map(img => img.url) 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;