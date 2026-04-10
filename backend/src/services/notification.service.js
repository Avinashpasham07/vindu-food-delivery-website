const admin = require('../config/firebase.config');
const User = require('../models/user.model');
const DeliveryPartner = require('../models/deliveryPartner.model');
const FoodPartner = require('../models/foodpartner.model');

class NotificationService {
    /**
     * Send notification to a specific user/partner
     * @param {string} receiverId - The ID of the recipient
     * @param {string} receiverModel - 'User' | 'DeliveryPartner' | 'FoodPartner'
     * @param {object} payload - { title: string, body: string, data?: object }
     */
    static async sendToUser(receiverId, receiverModel, payload) {
        try {
            let user;
            if (receiverModel === 'User') user = await User.findById(receiverId);
            else if (receiverModel === 'DeliveryPartner') user = await DeliveryPartner.findById(receiverId);
            else if (receiverModel === 'FoodPartner') user = await FoodPartner.findById(receiverId);

            if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
                console.log(`No FCM tokens found for ${receiverModel}: ${receiverId}`);
                return;
            }

            const messagePayload = {
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: payload.data || {},
                tokens: user.fcmTokens
            };

            const response = await admin.messaging().sendMulticast(messagePayload);
            
            // Cleanup stale tokens
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(user.fcmTokens[idx]);
                    }
                });

                if (failedTokens.length > 0) {
                    user.fcmTokens = user.fcmTokens.filter(token => !failedTokens.includes(token));
                    await user.save();
                    console.log(`Cleaned up ${failedTokens.length} stale tokens for ${receiverId}`);
                }
            }

            return response;
        } catch (error) {
            console.error('Push Notification Error:', error);
        }
    }

    /**
     * Broadcast to all available delivery partners (e.g., for new order)
     */
    static async broadcastToRiders(payload) {
        try {
            const riders = await DeliveryPartner.find({ status: 'online' });
            const allTokens = riders.flatMap(r => r.fcmTokens || []);

            if (allTokens.length === 0) return;

            const message = {
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: payload.data || {},
                tokens: allTokens
            };

            return await admin.messaging().sendMulticast(message);
        } catch (error) {
            console.error('Broadcast Riders Error:', error);
        }
    }
}

module.exports = NotificationService;
