const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    college: {
        type: String,
        required: [true, 'College name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        },
        address: {
            type: String,
            default: ''
        }
    },
    profilePicture: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: ''
    },
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    productsListed: {
        type: Number,
        default: 0
    },
    productsSold: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Create geospatial index for location-based queries
userSchema.index({ location: '2dsphere' });

// Index for faster email searches
userSchema.index({ email: 1 });

// Virtual field for full location
userSchema.virtual('fullLocation').get(function() {
    return {
        lat: this.location.coordinates[1],
        lng: this.location.coordinates[0],
        address: this.location.address
    };
});

// Method to calculate average rating
userSchema.methods.updateRating = function(newRating) {
    this.totalRatings += 1;
    this.ratings = ((this.ratings * (this.totalRatings - 1)) + newRating) / this.totalRatings;
    return this.save();
};

// Don't return password in JSON responses
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.verificationToken;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;