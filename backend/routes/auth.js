const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, college, phone } = req.body;

        // 1. Validate request body
        if (!name || !email || !password || !college || !phone) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }
        
        // --- COLLEGE EMAIL VALIDATION IS REMOVED ---

        // 2. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        
        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 12); 
        
        // 4. Create and save new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            college,
            phone
        });
        
        await user.save(); // This is where validation errors will be caught

        // 5. Create and send token
        const token = jwt.sign(
            { userId: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET,                  // Secret
            { expiresIn: '7d' }                      // Expiration
        );
        
        console.log('New signup:', { name, email, college });
        
        res.status(201).json({ 
            message: 'Signup successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college
            }
        });

    } catch (error) {
        console.error('Signup error:', error);

        // Check for Mongoose validation error
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message)[0];
            return res.status(400).json({ error: message });
        }

        // Check for duplicate email error (MongoDB code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        // Generic server error
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter email and password' });
        }

        // 1. Find user in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' }); 
        }
        
        // 2. Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' }); 
        }

        // 3. Create and send token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        console.log('User logged in:', email);
        
        res.json({ 
            token, 
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Verify token route
router.get('/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            // --- THIS IS THE CORRECTED LINE ---
            return res.status(401).json({ valid: false, error: 'No token provided' });
        }
        
        // Use the secret from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        
        // Send back user info from the token
        res.json({ valid: true, user: decoded }); 
    } catch (error) {
        // This will catch expired or invalid tokens
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
});

module.exports = router;