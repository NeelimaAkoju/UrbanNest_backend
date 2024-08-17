const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const Image = require('../models/Image'); // Assuming you have an Image model

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const categoriesWithImages = await Promise.all(categories.map(async (category) => {
      const image = await Image.findOne({ categoryId: category.id }).lean();
      return {
        ...category,
        image: image ? image.url : null
      };
    }));
    res.json(categoriesWithImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id }).lean();
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const image = await Image.findOne({ categoryId: category.id }).lean();
    res.json({
      ...category,
      image: image ? image.url : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products in a category
router.get('/:id/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit
    const products = await Product.find({ categoryId: req.params.id })
                                  .limit(limit)
                                  .lean();
    
    const productsWithImages = await Promise.all(products.map(async (product) => {
      const images = await Image.find({ productId: product.id }).lean();
      return {
        ...product,
        images: images.map(img => img.url)
      };
    }));
    
    res.json(productsWithImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;