const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import auth middleware
const User = require('../models/User'); // Import User model
const Product = require('../models/Product'); // Import Product model

// Get user profile (Protected Route)
// Use authMiddleware to get req.user.userId
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Find user by ID from the token, exclude the password
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        res.json({ 
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update user profile (Protected Route)
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, college, phone, location } = req.body;
        
        // Data to update
        const updateData = {
            name,
            college,
            phone,
            location // Assuming location is an object: { type: 'Point', coordinates: [lng, lat], address: '...' }
        };

        // Find user by ID and update them
        // { new: true } returns the updated document
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        console.log('Updating user profile:', updatedUser);
        
        res.json({ 
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's products (Protected Route)
router.get('/my-products', authMiddleware, async (req, res) => {
    try {
        // Find all products where the 'seller' field matches the user's ID
        const products = await Product.find({ seller: req.user.userId })
                                      .sort({ createdAt: -1 }); // Show newest first
        
        res.json({ 
            success: true,
            products: products
        });
    } catch (error) {
        console.error('Error fetching user products:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;