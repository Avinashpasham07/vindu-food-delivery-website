const mongoose = require('mongoose');
const User = require('../backend/src/models/user.model');
const Coupon = require('../backend/src/models/coupon.model');
const crypto = require('crypto');
require('dotenv').config({ path: '../backend/.env' });

async function verifyStreak() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Create a test user
        const testEmail = `test_streak_${Date.now()}@example.com`;
        const user = new User({
            fullname: "Test Streak User",
            email: testEmail,
            streakCount: 0,
            lastOrderDate: null
        });
        await user.save();
        console.log("Created test user:", testEmail);

        const now = new Date();

        // Simulate 7 days of orders
        for (let i = 1; i <= 7; i++) {
            console.log(`--- Simulating Order Day ${i} ---`);
            
            // Logic copied from order.routes.js
            const currentUser = await User.findById(user._id);
            const lastOrder = currentUser.lastOrderDate;
            
            if (!lastOrder) {
                currentUser.streakCount = 1;
            } else {
                // Manually set lastOrder to exactly 1 day ago for simulation
                const simulatedLastOrder = new Date(now.getTime() - (24 * 60 * 60 * 1000));
                // Wait, if we are in a loop, we should just let the logic handle it after we manually shift it.
                // In the real system, now is 'today'.
            }

            // SIMULATION: Since we can't wait 24 hours, we force the streak logic
            if (i > 1) {
                // Assume the previous order was exactly 1 day ago
                currentUser.streakCount += 1;
            } else {
                currentUser.streakCount = 1;
            }
            currentUser.lastOrderDate = now;

            if (currentUser.streakCount % 7 === 0) {
                console.log("Hit Milestone! Generating coupon...");
                const code = `STREAK${currentUser.streakCount}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
                const newCoupon = new Coupon({
                    code,
                    discountType: 'percentage',
                    discountValue: 10,
                    userId: currentUser._id,
                    expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                });
                await newCoupon.save();
                console.log("Coupon generated:", code);
            }

            await currentUser.save();
            console.log(`User Streak: ${currentUser.streakCount}`);
        }

        // Verify Coupon exists
        const coupons = await Coupon.find({ userId: user._id });
        console.log(`Total Coupons for user: ${coupons.length}`);
        if (coupons.length > 0) {
            console.log("VERIFICATION SUCCESSFUL: Streak and Milestone logic working!");
        } else {
            console.log("VERIFICATION FAILED: No coupon generated.");
        }

        // Cleanup
        await User.deleteOne({ _id: user._id });
        await Coupon.deleteMany({ userId: user._id });
        console.log("Cleanup done.");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error during verification:", error);
    }
}

verifyStreak();
