const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const { authuser } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const orderValidation = require('../validations/order.validation');

// Place a new Order
router.post('/place', authuser, validate(orderValidation.placeOrder), async (req, res) => {
    try {
        const { items, totalAmount, address, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const newOrder = new Order({
            userId: req.user._id,
            items,
            totalAmount,
            address,
            paymentMethod
        });

        const savedOrder = await newOrder.save();

        // Notify Delivery Partners
        const io = req.app.get('io');
        if (io) {
            io.to('delivery-room').emit('new-order', savedOrder);
        }

        res.status(201).json({ message: 'Order placed successfully', order: savedOrder });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get User's Orders
router.get('/user-orders', authuser, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('deliveryPartner', 'fullname phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Partner's Orders
router.get('/partner/:partnerId', async (req, res) => {
    try {
        const { partnerId } = req.params;
        // Find orders containing items from this partner
        // Complex query: Find orders where at least one item's foodId belongs to partner
        // Simplification: Fetch all active orders, populate, and filter in memory (not efficient for scale, ok for MVP)

        const orders = await Order.find({ status: { $ne: 'Cancelled' } })
            .populate({
                path: 'items.foodId',
                match: { foodpartner: partnerId } // Only populate if match
            })
            .populate('userId', 'fullname phone address')
            .populate('deliveryPartner', 'fullname phone')
            .sort({ createdAt: -1 });

        // Filter out orders where no items matched (items.foodId would be null for non-matches, wait, populate match returns null if not match?)
        // Actually, if match fails, foodId is null. If an order has OTHER items, they are null.
        // If ALL items are null, then this order is not for this partner.
        // Better approach:
        // 1. Find FoodItems by this partner.
        // 2. Find Orders containing these FoodItems.

        const Food = require('../models/food.model');
        const myFoodItems = await Food.find({ foodpartner: partnerId }).select('_id');
        const myFoodIds = myFoodItems.map(f => f._id);

        const relevantOrders = await Order.find({
            'items.foodId': { $in: myFoodIds }
        })
            .populate('items.foodId') // Now populate fully to show details
            .populate('userId', 'fullname phone address')
            .populate('deliveryPartner', 'fullname phone')
            .sort({ createdAt: -1 });

        res.json(relevantOrders);

    } catch (error) {
        console.error("Error fetching partner orders:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.foodId')
            .populate('userId', 'fullname phone address')
            .populate('deliveryPartner', 'fullname phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Order Status (Restaurant)
router.put('/:orderId/status', validate(orderValidation.updateStatus), async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // 'Preparing', 'Ready', 'Out_for_Delivery'

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;

        // If 'Ready', we might want to trigger "Searching" for delivery status automatically?
        // Or keep it manual via "Request Delivery" button.
        // Let's say "Ready" implies we are waiting for pickup.

        await order.save();

        const io = req.app.get('io');
        if (io) {
            io.to(`order-${orderId}`).emit('order-updated', order);
            io.emit('order-updated', order); // Broadcast to all for dashboard updates
        }

        res.json({ message: 'Status updated', order });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
