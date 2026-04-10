const mongoose = require('mongoose');


const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    location: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    fcmTokens: {
        type: [String],
        default: []
    }
});

const foodpartnermodel = mongoose.models.foodpartner || mongoose.model('foodpartner', foodPartnerSchema);
module.exports = foodpartnermodel;