const usermodel = require('../models/user.model');
const foodpartnermodel = require('../models/foodpartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');

async function registerUser(req, res) {
    try {
        const { fullname, email, password, phone } = req.body;

        const isUserExist = await usermodel.findOne({ email });
        if (isUserExist) {
            logger.warn(`Registration Failed: User already exists - ${email}`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new usermodel({
            fullname,
            email,
            phone,
            password: hashedPassword
        });

        await newUser.save();
        logger.info(`User Registered: ${newUser._id}`);

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
        );

        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', 
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email
            },
            token
        });

    } catch (err) {
        logger.error(`Registration Error: ${err.message}`);
        res.status(500).json({ message: "Server error" });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    logger.debug(`Login Attempt: ${email}`);

    try {
        const user = await usermodel.findOne({ email });

        if (!user) {
            logger.warn(`Login Failed: User not found - ${email}`);
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            logger.warn(`Login Failed: Password mismatch - ${email}`);
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Gold Expiry Check
        if (user.isGoldMember && user.goldExpiry) {
            if (new Date() > new Date(user.goldExpiry)) {
                user.isGoldMember = false;
                user.goldExpiry = null;
                await user.save();
                logger.info(`Gold Membership Expired for User: ${user._id}`);
            }
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
        );

        res.cookie("token", token, {
            httpOnly: true,
        });

        logger.info(`User Logged In: ${user._id}`);
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                isGoldMember: user.isGoldMember,
                goldExpiry: user.goldExpiry
            },
            token
        });
    } catch (err) {
        logger.error(`Login Error: ${err.message}`);
        res.status(500).json({ message: "Server error" });
    }
}

async function logoutUser(req, res) {
    res.clearCookie("token");
    logger.info("User Logged Out");
    res.status(200).json({
        message: "User logged out successfully"
    });
}

async function registerfoodpartner(req, res) {
    const { name, email, password, contactName, phone, address } = req.body;

    const isaccountexist = await foodpartnermodel.findOne({ email });
    if (isaccountexist) {
        return res.status(400).json({ message: "Food Partner already exists" });
    }
    const Hashpass = await bcrypt.hash(password, 10);

    const foodpartner = new foodpartnermodel({
        name,
        email,
        password: Hashpass,
        contactName,
        phone,
        address
    });

    const token = jwt.sign(
        { foodpartnerId: foodpartner._id },
        process.env.JWT_SECRET
    );

    res.cookie("token", token, {
        httpOnly: true,
    });
    await foodpartner.save();

    res.status(201).json({
        message: "Food Partner registered successfully",
        foodpartner: {
            id: foodpartner._id,
            name: foodpartner.name,
            email: foodpartner.email,
            contactName: foodpartner.contactName,
            phone: foodpartner.phone,
            address: foodpartner.address
        },
        token
    });
}

async function loginfoodpartner(req, res) {

    const { email, password } = req.body;


    const foodpartner = await foodpartnermodel.findOne({ email });
    if (!foodpartner) {
        return res.status(400).json({ message: "Invalid email or password" });
    }


    const isPasswordValid = await bcrypt.compare(password, foodpartner.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }


    const token = jwt.sign(
        { foodpartnerId: foodpartner._id },
        process.env.JWT_SECRET,
    );

    res.cookie("token", token, {
        httpOnly: true,
    });

    return res.status(200).json({
        message: "Food Partner logged in successfully",
        foodpartner: {
            id: foodpartner._id,
            name: foodpartner.name,
            email: foodpartner.email
        },
        token
    });

}

function logoutfoodpartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food Partner logged out successfully"
    });
}

async function getPartnerById(req, res) {
    try {
        const { id } = req.params;
        const partner = await foodpartnermodel.findById(id).select('-password'); // Exclude password

        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        res.status(200).json({
            message: "Partner retrieved successfully",
            partner
        });
    } catch (error) {
        console.error("Error fetching partner:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getUserFavorites(req, res) {
    try {
        const userId = req.user._id;
        const user = await usermodel.findById(userId).populate('favorites');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Favorites retrieved successfully",
            favorites: user.favorites
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function buyGoldMembership(req, res) {
    try {
        const userId = req.user._id;
        const user = await usermodel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Simulate Payment Success
        // In real app, verify Razorpay/Stripe payment here

        user.isGoldMember = true;

        // set expiry to 30 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        user.goldExpiry = expiryDate;

        await user.save();

        res.status(200).json({
            message: "Welcome to Vindu Gold!",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                isGoldMember: user.isGoldMember,
                goldExpiry: user.goldExpiry
            }
        });

    } catch (error) {
        console.error("Error buying gold:", error);
        res.status(500).json({ message: "Transaction failed" });
    }
}

module.exports = { registerUser, loginUser, logoutUser, registerfoodpartner, loginfoodpartner, logoutfoodpartner, getPartnerById, getUserFavorites, buyGoldMembership };