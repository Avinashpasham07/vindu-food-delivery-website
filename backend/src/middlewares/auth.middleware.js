const foodpartnermodel = require('../models/foodpartner.model');
const usermodel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authfoodpatner(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodpartner = await foodpartnermodel.findById(decoded.foodpartnerId);

        if (!foodpartner) {
            return res.status(401).json({
                message: "Not authorized: invalid food partner token"
            });
        }

        req.foodpartner = foodpartner;
        next();

    } catch (err) {
        return res.status(401).json({
            message: "invalid token, authorization denied"
        });
    }
}

const logger = require('../utils/logger');

async function authuser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded.userId);

        if (!user) {
            logger.warn(`User Not Found in Auth Middleware: ${decoded.userId}`);
            return res.status(401).json({
                message: "Not authorized: invalid user token"
            });
        }

        // --- Streak Automatic Reset Logic (Snapchat style) ---
        if (user.streakCount > 0 && user.lastOrderDate) {
            const now = new Date();
            const lastOrder = new Date(user.lastOrderDate);
            const diffInTime = now.getTime() - lastOrder.getTime();
            const diffInDays = diffInTime / (1000 * 3600 * 24);

            // If more than 48 hours passed (2 full days), streak breaks
            if (diffInDays > 2) {
                user.streakCount = 0;
                await user.save();
                logger.info(`Streak Reset to 0 for User: ${user._id} (Last order was ${Math.floor(diffInDays)} days ago)`);
            }
        }

        req.user = user;
        next();

    } catch (err) {
        logger.error(`Auth Error: ${err.message}`, { token: token ? token.substring(0, 20) + '...' : 'NONE' });
        return res.status(401).json({
            message: "invalid token, authorization denied"
        });
    }
}

async function authAdmin(req, res, next) {
    authuser(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                message: "Access Denied: Admin privileges required"
            });
        }
    });
}

async function authAny(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: login first" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try to find User
        if (decoded.userId) {
            const user = await usermodel.findById(decoded.userId);
            if (user) {
                req.user = user;
                return next();
            }
        }

        // Try to find Partner
        if (decoded.foodpartnerId) {
            const foodpartner = await foodpartnermodel.findById(decoded.foodpartnerId);
            if (foodpartner) {
                req.foodpartner = foodpartner;
                return next();
            }
        }

        return res.status(401).json({ message: "Not authorized: invalid token" });

    } catch (err) {
        return res.status(401).json({ message: "invalid token" });
    }
}

const DeliveryPartner = require('../models/deliveryPartner.model');

async function authDeliveryPartner(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: login first" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.deliveryPartnerId) throw new Error('Invalid token type');

        const partner = await DeliveryPartner.findById(decoded.deliveryPartnerId);
        if (!partner) return res.status(401).json({ message: "Not authorized: partner not found" });

        req.deliveryPartner = partner;
        next();
    } catch (err) {
        return res.status(401).json({ message: "invalid token, authorization denied" });
    }
}

module.exports = { authfoodpatner, authuser, authUser: authuser, authAny, authDeliveryPartner, authAdmin };
