const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed', 'free_delivery'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
