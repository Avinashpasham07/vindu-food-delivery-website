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
                image: Joi.string(),
                video: Joi.string().allow('')
            })
        ).required().min(1),
        totalAmount: Joi.number().required(),
        address: Joi.object().required(),
        paymentMethod: Joi.string().required().valid('card', 'upi', 'cod')
    })
};

const updateStatus = {
    params: Joi.object().keys({
        orderId: Joi.string().required()
    }),
    body: Joi.object().keys({
        status: Joi.string().required().valid('Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled')
    })
};

module.exports = {
    placeOrder,
    updateStatus
};
