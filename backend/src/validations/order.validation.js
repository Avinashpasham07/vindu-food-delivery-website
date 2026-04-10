const Joi = require('joi');
const { join } = require('path');

const placeOrder = {
    body: Joi.object().keys({
        items: Joi.array().items(
            Joi.object().keys({
                foodId: Joi.string().required(),
                name: Joi.string(),
                price: Joi.number(),
                quantity: Joi.number(),
                image: Joi.string().allow('', null),
                video: Joi.string().allow('')
            })
        ).required().min(1),
        totalAmount: Joi.number().required(),
        address: Joi.object().required(),
        paymentMethod: Joi.string().required().valid('card', 'upi', 'cod'),
        couponCode: Joi.string().optional().allow('', null),
        customerLocation: Joi.object().keys({
            lat: Joi.number().allow(null),
            lng: Joi.number().allow(null)
        }).optional()
    })
};

const updateStatus = {
    params: Joi.object().keys({
        orderId: Joi.string().required()
    }),
    body: Joi.object().keys({
        status: Joi.string().required().valid('Placed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled')
    })
};

module.exports = {
    placeOrder,
    updateStatus
};
