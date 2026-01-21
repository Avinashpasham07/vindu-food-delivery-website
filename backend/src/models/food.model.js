const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        default: 'video'
    },
    images: {
        type: [String],
        default: []
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 249
    },
    ingredients: {
        type: [String],
        default: []
    },
    prepTime: {
        type: String,
        default: "20-30 min"
    },
    calories: {
        type: String,
        default: "350 kcal"
    },
    nutrition: {
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fats: { type: Number, default: 0 }
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Starters', 'Desserts', 'Beverages', 'Snacks', 'Biryani', 'Pizza', 'Burger', 'Healthy', 'Thali']
    },
    foodType: {
        type: String,
        required: true,
        default: 'Veg',
        enum: ['Veg', 'Non-Veg']
    },
    discount: {
        type: String,
        default: ''
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    foodpartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodpartner',
    },
    moods: {
        type: [String],
        default: [],
        // e.g. ['Happy', 'Sad', 'Energetic', 'Romantic', 'Lazy']
    },
    tags: {
        type: [String],
        default: []
        // e.g. ['Comfort Food', 'Spicy', 'Sweet', 'Healthy']
    }
})

// Indexes for faster search and filtering
foodItemSchema.index({ name: 'text' }); // Text search capability
foodItemSchema.index({ category: 1 }); // Filter by category
foodItemSchema.index({ foodType: 1 }); // Filter by Veg/Non-Veg
foodItemSchema.index({ price: 1 }); // Sort by price
foodItemSchema.index({ averageRating: -1 }); // Sort by rating

const foodmodel = mongoose.model('fooditem', foodItemSchema);

module.exports = foodmodel;