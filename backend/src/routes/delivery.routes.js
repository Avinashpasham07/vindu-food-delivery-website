const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { authDeliveryPartner } = require('../middlewares/auth.middleware');

// Auth
router.post('/register', deliveryController.register);
router.post('/login', deliveryController.login);
router.get('/logout', deliveryController.logout);

// Protected Routes
router.post('/toggle-status', authDeliveryPartner, deliveryController.toggleStatus);
router.get('/orders/available', authDeliveryPartner, deliveryController.getAvailableOrders);
router.post('/orders/accept', authDeliveryPartner, deliveryController.acceptOrder);
router.put('/orders/status', authDeliveryPartner, deliveryController.updateOrderStatus);
router.get('/orders/current', authDeliveryPartner, deliveryController.getCurrentOrder);
router.get('/history', authDeliveryPartner, deliveryController.getDeliveryHistory);

module.exports = router;
