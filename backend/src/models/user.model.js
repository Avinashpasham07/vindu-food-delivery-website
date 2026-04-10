const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
        default: ''
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fooditem'
    }],
    isGoldMember: {
        type: Boolean,
        default: false
    },
    goldExpiry: {
        type: Date,
        default: null
    },
    streakCount: {
        type: Number,
        default: 0
    },
    lastOrderDate: {
        type: Date,
        default: null
    },
    location: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    fcmTokens: {
        type: [String],
        default: []
    }
},
    {
        timestamps: true
    }
)

const usermodel = mongoose.model('user', userSchema);
module.exports = usermodel;
