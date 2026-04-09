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
    streakCount: {
        type: Number,
        default: 0
    },
    lastOrderDate: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},
    {
        timestamps: true
    }
)

const usermodel = mongoose.model('user', userSchema);
module.exports = usermodel;
