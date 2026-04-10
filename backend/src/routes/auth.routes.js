const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

// for user auth apis
router.post('/user/register', validate(authValidation.userRegister), authController.registerUser);
router.post('/user/login', validate(authValidation.userLogin), authController.loginUser);
router.get('/user/logout', authController.logoutUser);

// for food partner auth apis
router.post('/foodpartner/register', validate(authValidation.foodPartnerRegister), authController.registerfoodpartner);
router.post('/foodpartner/login', validate(authValidation.foodPartnerLogin), authController.loginfoodpartner);
router.get('/foodpartner/logout', authController.logoutfoodpartner);
router.get('/partner/:id', authController.getPartnerById);
router.put('/partner/update/:id', authController.updatePartnerProfile);

router.get('/user/favorites', authMiddleware.authUser, authController.getUserFavorites);
router.get('/user/me', authMiddleware.authUser, authController.getMe);
router.post('/buy-gold', authMiddleware.authUser, authController.buyGoldMembership);

// Update FCM Token for Push Notifications
router.post('/update-fcm-token', async (req, res) => {
    try {
        const { userId, role, token } = req.body;
        if (!userId || !role || !token) return res.status(400).json({ message: 'Missing data' });

        let model;
        if (role === 'user' || role === 'admin') model = require('../models/user.model');
        else if (role === 'foodPartner') model = require('../models/foodpartner.model');
        else if (role === 'deliveryPartner') model = require('../models/deliveryPartner.model');

        const user = await model.findById(userId);
        if (user) {
            if (!user.fcmTokens.includes(token)) {
                user.fcmTokens.push(token);
                await user.save();
            }
            res.json({ message: 'Token updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating token', error: err.message });
    }
});

module.exports = router;