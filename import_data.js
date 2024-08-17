const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Use environment variable for MongoDB URI, with a fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define schemas
const categorySchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  creationAt: Date,
  updatedAt: Date,
});

const imageSchema = new mongoose.Schema({
  productId: Number,
  url: String,
});

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  creationAt: Date,
  updatedAt: Date,
  categoryId: Number,
});

// Create models
const Category = mongoose.model('Category', categorySchema);
const Image = mongoose.model('Image', imageSchema);
const Product = mongoose.model('Product', productSchema);

// Read and parse the JSON file
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

// Function to import data
async function importData() {
  try {
    

    const categories = new Map();
    const images = [];
    const productsToInsert = [];

    for (const product of products) {
      // Handle category
      if (!categories.has(product.category.id)) {
        categories.set(product.category.id, product.category);
      }

      // Handle images
      product.images.forEach(image => {
        if (typeof image === 'string') {
          images.push({ productId: product.id, url: image });
        } else if (Array.isArray(image)) {
          image.forEach(url => {
            images.push({ productId: product.id, url: url });
          });
        }
      });

      // Handle product
      productsToInsert.push({
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        creationAt: new Date(product.creationAt),
        updatedAt: new Date(product.updatedAt),
        categoryId: product.category.id,
      });
    }

    // Insert categories
    await Category.insertMany(Array.from(categories.values()));

    // Insert images
    await Image.insertMany(images);

    // Insert products
    await Product.insertMany(productsToInsert);

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    mongoose.connection.close();
  }
}

importData();