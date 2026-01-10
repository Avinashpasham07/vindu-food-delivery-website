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

async function authuser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: login first"
        });
    }

    const fs = require('fs');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // fs.appendFileSync('auth_debug.log', `[${new Date().toISOString()}] Success: ${JSON.stringify(decoded)}\n`);
        const user = await usermodel.findById(decoded.userId);

        if (!user) {
            fs.appendFileSync('auth_debug.log', `[${new Date().toISOString()}] User Not Found: ${decoded.userId}\n`);
            return res.status(401).json({
                message: "Not authorized: invalid user token"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        fs.appendFileSync('auth_debug.log', `[${new Date().toISOString()}] Error: ${err.message} | Token: ${token ? token.substring(0, 20) + '...' : 'NONE'}\n`);
        return res.status(401).json({
            message: "invalid token, authorization denied"
        });
    }
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

module.exports = { authfoodpatner, authuser, authUser: authuser, authAny, authDeliveryPartner };
