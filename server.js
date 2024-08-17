const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes for products
app.use('/api/products', require('./routes/products'));

// Routes for categories
app.use('/api/categories', require('./routes/categories'));

// Routes for search
app.use('/api/search', require('./routes/search'));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));