const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const FoodPartner = require('../models/foodpartner.model');
const Order = require('../models/order.model');
const FoodItem = require('../models/food.model');
const DeliveryPartner = require('../models/deliveryPartner.model');
const { authAdmin } = require('../middlewares/auth.middleware');

// GET Admin Dashboard Stats
router.get('/stats', authAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalPartners = await FoodPartner.countDocuments();
        const pendingPartners = await FoodPartner.countDocuments({ isVerified: false });
        const pendingRiders = await DeliveryPartner.countDocuments({ isVerified: false });
        
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const recentOrders = await Order.find()
            .populate('userId', 'fullname email')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                totalUsers,
                totalPartners,
                totalOrders,
                pendingPartners,
                pendingRiders,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            recentOrders
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET All Customers
router.get('/users', authAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET All Food Partners (Restore)
router.get('/partners', authAdmin, async (req, res) => {
    try {
        const partners = await FoodPartner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET All Delivery Partners
router.get('/delivery-partners', authAdmin, async (req, res) => {
    try {
        const partners = await DeliveryPartner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Toggle Delivery Partner Status
router.put('/delivery-partner/:id/toggle-status', authAdmin, async (req, res) => {
    try {
        const partner = await DeliveryPartner.findById(req.params.id);
        if (!partner) return res.status(404).json({ message: 'Delivery Partner not found' });

        partner.isVerified = !partner.isVerified;
        await partner.save();

        res.json({ message: `Rider ${partner.isVerified ? 'Verified' : 'Unverified'} Successfully`, isVerified: partner.isVerified });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET All Orders (Comprehensive)
router.get('/orders', authAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'fullname email phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Toggle Partner Status (Deactivate/Activate)
router.put('/partner/:id/toggle-status', authAdmin, async (req, res) => {
    try {
        const partner = await FoodPartner.findById(req.params.id);
        if (!partner) return res.status(404).json({ message: 'Partner not found' });

        partner.isVerified = !partner.isVerified;
        await partner.save();

        res.json({ message: `Partner ${partner.isVerified ? 'Verified' : 'Unverified'} Successfully`, isVerified: partner.isVerified });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Order Status (Admin Override)
router.put('/order/:id/status', authAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
