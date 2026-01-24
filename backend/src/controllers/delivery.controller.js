const DeliveryPartner = require('../models/deliveryPartner.model');
const Order = require('../models/order.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Auth Functions
async function register(req, res) {
    try {
        const { fullname, email, password, phone } = req.body;
        const exists = await DeliveryPartner.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Partner already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const partner = new DeliveryPartner({
            fullname,
            email,
            password: hashedPassword,
            phone
        });

        await partner.save();

        const token = jwt.sign({ deliveryPartnerId: partner._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({
            message: 'Registered successfully',
            partner: { id: partner._id, fullname: partner.fullname, email: partner.email, status: partner.status },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const partner = await DeliveryPartner.findOne({ email });
        if (!partner) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ deliveryPartnerId: partner._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({
            message: 'Logged in successfully',
            partner: { id: partner._id, fullname: partner.fullname, email: partner.email, status: partner.status },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function logout(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

// Operational Functions
async function toggleStatus(req, res) {
    try {
        const { status } = req.body; // 'online' or 'offline'
        // Assuming middleware attaches req.deliveryPartner
        // If not using middleware yet, we might need to rely on passed ID or fix middleware later.
        // For now, let's assume we pass ID in body or header if not fully implementing middleware right this second, 
        // but robust way is middleware. I will create a simple middleware usage assumption or check `orders.routes` likely has one.
        // Let's implement middleware-less first or rely on token decoding if needed, but standard is `req.user` equivalent.
        // I will assume `req.deliveryPartner` is set by a middleware we will create or reuse logic.

        // Actually, let's look at `authMiddleware`.
        // I should probably add `authMiddleware.authDeliveryPartner` separately. 
        // For now, I'll assume we can get ID from req.params for simplicity or standard auth.
        // BUT, better to implement `authMiddleware` for delivery.

        // I will proceed assuming I will update middleware or use logic here.
        // Let's rely on `req.deliveryPartner` being populated by a middleware I'll add.

        const partner = req.deliveryPartner;
        partner.status = status;
        await partner.save();
        res.json({ message: `Status updated to ${status}`, status: partner.status });

    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
}

async function getAvailableOrders(req, res) {
    try {
        // Find orders that are placed/preparing and NOT assigned yet (Searching)
        const orders = await Order.find({ deliveryStatus: 'Searching' })
            .populate('items.foodId')
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
}

async function acceptOrder(req, res) {
    try {
        const { orderId } = req.body;
        const partner = req.deliveryPartner;

        console.log(`Debug acceptOrder: Partner ${partner.fullname} try accept. currentOrder: ${partner.currentOrder}`);

        if (partner.currentOrder) {
            console.log("Debug: Partner already has active order", partner.currentOrder);
            // Sync Frontend: Return the existing order
            const existingOrder = await Order.findById(partner.currentOrder)
                .populate('items.foodId')
                .populate('userId', 'fullname phone address');

            if (existingOrder) {
                return res.json({ message: 'Restored active order', order: existingOrder });
            } else {
                // Zombie ID (order deleted) - clear it and proceed
                console.log("Debug: stored currentOrder is invalid/deleted. Clearing.");
                partner.currentOrder = null;
                partner.status = 'online';
                await partner.save();
                // Fall through to accept the NEW order
            }
        }

        if (partner.status !== 'online') {
            console.log("Debug: Blocked - Partner status is", partner.status);
            return res.status(400).json({ message: 'You must be "Online" to accept orders' });
        }

        console.log("Debug: Finding order", orderId);
        const order = await Order.findById(orderId);
        if (!order) {
            console.log("Debug: Order not found in DB");
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log("Debug: Order Status is", order.deliveryStatus);
        if (order.deliveryStatus !== 'Searching') {
            console.log("Debug: Order already assigned/taken");
            return res.status(400).json({ message: 'Order already assigned' });
        }

        console.log("Debug: Assigning order to partner");
        order.deliveryPartner = partner._id;
        order.deliveryStatus = 'Assigned';
        await order.save();

        console.log("Debug: Updating partner status");
        partner.currentOrder = order._id;
        partner.status = 'busy';
        await partner.save();

        // Notify User and Delivery Room
        const io = req.app.get('io');

        // Populate before sending back
        console.log("Debug: Populating order details");
        const populatedOrder = await order.populate([
            { path: 'items.foodId' },
            { path: 'userId', select: 'fullname phone address' }
        ]);

        if (io) {
            // Note: populatedOrder.userId is now an object, so use populatedOrder.userId._id
            // Safety check: userId might be null if user was deleted
            if (populatedOrder.userId) {
                io.to(`user-${populatedOrder.userId._id}`).emit('order-updated', populatedOrder);
            }
            io.to('delivery-room').emit('order-taken', { orderId });
        }

        console.log("Debug: Success, returning response");
        res.json({ message: 'Order accepted', order: populatedOrder });
    } catch (error) {
        console.error("Error in acceptOrder:", error); // Add Logging
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', error: error.message });
        }
        res.status(500).json({ message: 'Error accepting order', error: error.message });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { orderId, status } = req.body; // 'PickedUp', 'Delivered'
        const partner = req.deliveryPartner;

        const order = await Order.findOne({ _id: orderId, deliveryPartner: partner._id });
        if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });

        order.deliveryStatus = status;
        if (status === 'Delivered') {
            order.status = 'Delivered';
            partner.currentOrder = null;
            partner.status = 'online';
            partner.earnings += 40; // Flat fee for now
            await partner.save();
        } else if (status === 'PickedUp') {
            order.status = 'Out for Delivery';
        }

        await order.save();

        // Notify User via Socket
        const io = req.app.get('io');
        if (io) {
            io.to(`user-${order.userId}`).emit('order-updated', order);
        }

        res.json({ message: `Order status updated to ${status}`, order });

    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
}

async function getCurrentOrder(req, res) {
    try {
        const partner = req.deliveryPartner;
        if (!partner.currentOrder) return res.json({ order: null });

        const order = await Order.findById(partner.currentOrder).populate('items.foodId').populate('userId', 'fullname phone address');

        // Self-Healing: If order is not found (deleted?), clear the partner's status
        if (!order) {
            partner.currentOrder = null;
            partner.status = 'online';
            await partner.save();
            return res.json({ order: null });
        }

        res.json({ order });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching current order', error: error.message });
    }
}

async function getDeliveryHistory(req, res) {
    try {
        const partner = req.deliveryPartner;
        const history = await Order.find({
            deliveryPartner: partner._id,
            deliveryStatus: 'Delivered'
        })
            .populate('items.foodId')
            .populate('userId', 'fullname phone address')
            .sort({ createdAt: -1 });

        // Calculate Daily Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let todayEarnings = 0;
        let todayDeliveries = 0;

        history.forEach(order => {
            const orderDate = new Date(order.createdAt);
            if (orderDate >= today) {
                todayEarnings += 40; // Flat fee
                todayDeliveries += 1;
            }
        });

        res.json({
            history,
            status: partner.status, // Return real-time status
            stats: {
                totalEarnings: partner.earnings,
                totalDeliveries: history.length,
                todayEarnings,
                todayDeliveries
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history', error: error.message });
    }
}

module.exports = {
    register,
    login,
    logout,
    toggleStatus,
    getAvailableOrders,
    acceptOrder,
    updateOrderStatus,
    getCurrentOrder,
    getDeliveryHistory
};
