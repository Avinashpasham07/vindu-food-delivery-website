const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Coupon = require('../models/coupon.model');
const { authuser } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const orderValidation = require('../validations/order.validation');
const crypto = require('crypto');
const NotificationService = require('../services/notification.service');

// Place a new Order
router.post('/place', authuser, validate(orderValidation.placeOrder), async (req, res) => {
    try {
        const { items, totalAmount, address, paymentMethod, couponCode, customerLocation } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        let finalAmount = totalAmount;
        let couponApplied = null;

        // Apply Coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                userId: req.user._id,
                isActive: true,
                isUsed: false,
                expiryDate: { $gt: new Date() }
            });

            if (coupon) {
                if (coupon.discountType === 'percentage') {
                    finalAmount = totalAmount * (1 - coupon.discountValue / 100);
                } else if (coupon.discountType === 'fixed') {
                    finalAmount = Math.max(0, totalAmount - coupon.discountValue);
                } else if (coupon.discountType === 'free_delivery') {
                    // Logic for free delivery if delivery fee was included
                    // For now, let's assume it's a fixed reduction or just a flag
                }
                couponApplied = coupon;
            } else {
                return res.status(400).json({ message: 'Invalid or expired coupon' });
            }
        }

        // Fetch Restaurant Location from the first item's partner
        let restaurantLocation = null;
        if (items.length > 0) {
            const Food = require('../models/food.model');
            const foodItem = await Food.findById(items[0].foodId).populate('foodpartner');
            if (foodItem?.foodpartner?.location?.lat) {
                restaurantLocation = foodItem.foodpartner.location;
            }
        }

        const newOrder = new Order({
            userId: req.user._id,
            items,
            totalAmount: finalAmount,
            address,
            customerLocation,
            restaurantLocation,
            paymentMethod
        });

        const savedOrder = await newOrder.save();

        if (couponApplied) {
            couponApplied.isUsed = true;
            await couponApplied.save();
        }

        // --- Streak Logic ---
        const user = await User.findById(req.user._id);
        const now = new Date();
        const lastOrder = user.lastOrderDate;
        let streakReward = null;

        if (!lastOrder) {
            user.streakCount = 1;
        } else {
            const diffInTime = now.getTime() - lastOrder.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

            if (diffInDays === 1) {
                user.streakCount += 1;
            } else if (diffInDays > 1) {
                user.streakCount = 1;
            }
            // If diffInDays is 0, they already ordered today, streak stays the same
        }

        user.lastOrderDate = now;

        // Reward Milestone (7 days)
        if (user.streakCount > 0 && user.streakCount % 7 === 0) {
            const streakNum = user.streakCount;
            const code = `STREAK${streakNum}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
            
            const newCoupon = new Coupon({
                code,
                discountType: 'percentage',
                discountValue: 10,
                userId: user._id,
                expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
            });
            await newCoupon.save();
            streakReward = {
                message: `Congratulations! You've hit a ${streakNum}-day streak!`,
                coupon: code
            };
        }

        await user.save();

        // Notify Delivery Partners & Restaurant
        const io = req.app.get('io');
        if (io) {
            io.to('delivery-room').emit('new-order', savedOrder);
        }

        // [PUSH NOTIFICATION] Notify Restaurant
        if (items.length > 0) {
            const Food = require('../models/food.model');
            const foodItem = await Food.findById(items[0].foodId).populate('foodpartner');
            if (foodItem?.foodpartner) {
                NotificationService.sendToUser(foodItem.foodpartner._id, 'FoodPartner', {
                    title: 'New Order Received! 🍳',
                    body: `You have a new order (#${savedOrder._id.toString().slice(-6).toUpperCase()}) for ₹${finalAmount}.`,
                    data: { orderId: savedOrder._id.toString(), type: 'NEW_ORDER' }
                });
            }
        }

        res.status(201).json({ 
            message: 'Order placed successfully', 
            order: savedOrder,
            streak: user.streakCount,
            reward: streakReward
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET Chat History for Order
router.get('/:id/messages', async (req, res) => {
    try {
        const Message = require('../models/message.model');
        const messages = await Message.find({ orderId: req.params.id })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat logs', error: error.message });
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
        let order = await Order.findById(req.params.id)
            .populate({
                path: 'items.foodId',
                populate: { path: 'foodpartner' } // Deep populate partner for name/address
            })
            .populate('userId', 'fullname phone address')
            .populate('deliveryPartner', 'fullname phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // --- Auto-Repair: Missing Restaurant Location ---
        // If the order has no location, try to pull it from the current restaurant profile
        if (!order.restaurantLocation?.lat && order.items.length > 0) {
            const Food = require('../models/food.model');
            // Safely get the ID even if foodId is already populated
            const foodId = order.items[0].foodId._id || order.items[0].foodId;
            const foodItem = await Food.findById(foodId).populate('foodpartner');
            
            if (foodItem?.foodpartner?.location?.lat) {
                // Return the updated location even if it's not saved to the order yet
                const orderObj = order.toObject();
                orderObj.restaurantLocation = foodItem.foodpartner.location;
                order = orderObj;
            }
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

        if (io) {
            io.to(`order-${orderId}`).emit('order-updated', order);
            io.emit('order-updated', order); // Broadcast to all for dashboard updates
        }

        // [PUSH NOTIFICATION] Notify Customer
        let title = 'Order Update! ✨';
        let body = `Your order is now ${status.toLowerCase()}.`;

        if (status === 'Preparing') {
            title = 'Cooking Started! 👨‍🍳';
            body = 'The restaurant is now preparing your delicious meal.';
        } else if (status === 'Ready') {
            title = 'Order Ready! 🍱';
            body = 'Your food is ready and waiting for a delivery partner.';
        }

        NotificationService.sendToUser(order.userId, 'User', {
            title,
            body,
            data: { orderId: order._id.toString(), type: 'ORDER_STATUS_UPDATE' }
        });

        res.json({ message: 'Status updated', order });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get User's Coupons
router.get('/my-coupons', authuser, async (req, res) => {
    try {
        const coupons = await Coupon.find({ 
            userId: req.user._id,
            isActive: true,
            isUsed: false,
            expiryDate: { $gt: new Date() }
        }).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
