const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const axios = require('axios'); // Import axios

// Get all products with filters (Public Route)
// ... (this route remains unchanged)
router.get('/', async (req, res) => {
    try {
        const { college, category, maxPrice, q, status } = req.query;
        let filter = { status: status || 'Available' };
        if (college) filter.college = new RegExp(college, 'i');
        if (category) filter.category = category;
        if (maxPrice) filter.price = { $lte: Number(maxPrice) };
        if (q) filter.$text = { $search: q };
        
        const products = await Product.find(filter)
            .populate('seller', 'name college')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: products.length, products: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
});


// Get single product (Public Route)
// ... (this route remains unchanged)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email phone college');
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, product: product });
    } catch (error) {
        console.error('Error fetching single product:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// --- THIS IS THE UPDATED ROUTE ---
// Create new product (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const productData = req.body;
        productData.seller = req.user.userId;

        // 1. Geocode the college address
        const encodedAddress = encodeURIComponent(productData.college);
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        
        const geocodeResponse = await axios.get(geocodeUrl);
        const geocodeData = geocodeResponse.data;

        if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
            throw new Error('Could not find coordinates for the college provided.');
        }

        const location = geocodeData.results[0].geometry.location;
        
        // 2. Set the location data before saving
        productData.location = {
            type: 'Point',
            coordinates: [location.lng, location.lat], // [longitude, latitude]
            address: geocodeData.results[0].formatted_address
        };

        // 3. Save to database
        const newProduct = new Product(productData);
        await newProduct.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message || 'Server error creating product' });
    }
});
// --- END OF UPDATE ---


// Update product (Protected Route)
// ... (this route remains unchanged)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (product.seller.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'User not authorized to update this product' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Server error updating product' });
    }
});


// Delete product (Protected Route)
// ... (this route remains unchanged)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (product.seller.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'User not authorized to delete this product' });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Server error deleting product' });
    }
});

module.exports = router;
