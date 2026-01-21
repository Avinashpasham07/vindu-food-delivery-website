const usermodel = require('../models/user.model');
const foodpartnermodel = require('../models/foodpartner.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    try {
        const { fullname, email, password, phone } = req.body;


        const isuserexist = await usermodel.findOne({ email });
        if (isuserexist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const Hashpass = await bcrypt.hash(password, 10);


        const newUser = new usermodel({
            fullname,
            email,
            phone,
            password: Hashpass
        });

        await newUser.save();


        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
        );


        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Uncomment in production
            // sameSite: 'strict' 
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
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    console.log("Login Attempt:", email); // DEBUG LOG

    const user = await usermodel.findOne({ email });

    if (!user) {
        console.log("Login Failed: User not found for email", email);
        return res.status(400).json({
            message: "Debug: User not found with this email"
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("User found, password valid:", isPasswordValid); // DEBUG LOG
    if (!isPasswordValid) {
        console.log("Login Failed: Password mismatch");
        return res.status(400).json({
            message: "Debug: Password mismatch"
        });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
    );

    res.cookie("token", token, {
        httpOnly: true,
    });

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email
        },
        token
    });
}

async function logoutUser(req, res) {
    res.clearCookie("token");
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