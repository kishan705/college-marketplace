const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    isNegotiable: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Laptop', 'Books', 'Bike', 'Electronics', 'Stationery', 'Furniture', 'Clothing', 'Sports', 'Other'],
            message: '{VALUE} is not a valid category'
        }
    },
    condition: {
        type: String,
        required: [true, 'Product condition is required'],
        enum: {
            values: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
            message: '{VALUE} is not a valid condition'
        },
        default: 'Good'
    },
    images: [{
        type: String, // URLs to images (Cloudinary/AWS S3)
        trim: true
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    college: {
        type: String,
        required: [true, 'College name is required'],
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: {
            type: String,
            default: ''
        }
    },
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Reserved', 'Deleted'],
        default: 'Available'
    },
    views: {
        type: Number,
        default: 0
    },
    interestedBuyers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Create geospatial index for location-based searches
productSchema.index({ location: '2dsphere' });

// Index for faster searches
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ college: 1 });
productSchema.index({ createdAt: -1 });

// Text index for search functionality
productSchema.index({ 
    title: 'text', 
    description: 'text', 
    tags: 'text' 
});

// Virtual field for full location
productSchema.virtual('fullLocation').get(function() {
    return {
        lat: this.location.coordinates[1],
        lng: this.location.coordinates[0],
        address: this.location.address
    };
});

// Method to increment views
productSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Method to mark as sold
productSchema.methods.markAsSold = function() {
    this.status = 'Sold';
    return this.save();
};

// Static method to find products within radius
productSchema.statics.findNearby = function(lng, lat, radiusInKm) {
    return this.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                $maxDistance: radiusInKm * 1000 // Convert km to meters
            }
        },
        status: 'Available'
    });
};

// Pre-save middleware to generate tags from title
productSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        // Extract words from title as tags
        const words = this.title.toLowerCase().split(' ');
        this.tags = [...new Set([...this.tags, ...words])]; // Remove duplicates
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;