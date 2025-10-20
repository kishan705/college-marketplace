const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.' 
            });
        }
        
        // Verify token using secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request object
        req.user = verified;
        
        // Continue to next middleware/route
        next();
    } catch (error) {
        // Token is invalid or expired
        res.status(400).json({ 
            error: 'Invalid token' 
        });
    }
};

// Export the middleware function
module.exports = authMiddleware;