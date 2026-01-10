const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Fixed match with user.model.js
        required: true
    },
    items: [{
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fooditem', // Fixed match with food.model.js
            required: true
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String, // Store visual reference
        video: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    paymentMethod: {
        type: String, // 'card', 'upi', 'cod'
        required: true
    },
    status: {
        type: String,
        enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner',
        default: null
    },
    deliveryStatus: {
        type: String,
        enum: ['Searching', 'Assigned', 'PickedUp', 'Delivered', 'Cancelled'],
        default: 'Searching'
    }
});

// Indexes for performance
orderSchema.index({ userId: 1 }); // Fast history lookup
orderSchema.index({ deliveryPartner: 1 }); // Fast partner assignment lookup
orderSchema.index({ deliveryStatus: 1 }); // Fast dashboard filtering
orderSchema.index({ status: 1 }); // Fast status filtering
orderSchema.index({ createdAt: -1 }); // Fast sorting by newest

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
