const Joi = require('joi');

const createFood = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        ingredients: Joi.string().allow(''),
        prepTime: Joi.string().allow(''),
        calories: Joi.string().allow(''),
        category: Joi.string().required().valid('Starters', 'Desserts', 'Beverages', 'Snacks', 'Biryani', 'Pizza', 'Burger', 'Healthy', 'Thali'),
        foodType: Joi.string().required().valid('Veg', 'Non-Veg'),
        discount: Joi.string().allow(''),
        protein: Joi.number().allow(''),
        carbs: Joi.number().allow(''),
        fats: Joi.number().allow('')
    })
};

const updateFood = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        ingredients: Joi.string().allow(''),
        prepTime: Joi.string().allow(''),
        calories: Joi.string().allow(''),
        category: Joi.string().valid('Starters', 'Desserts', 'Beverages', 'Snacks', 'Biryani', 'Pizza', 'Burger', 'Healthy', 'Thali'),
        foodType: Joi.string().valid('Veg', 'Non-Veg'),
        discount: Joi.string().allow(''),
        protein: Joi.number().allow(''),
        carbs: Joi.number().allow(''),
        fats: Joi.number().allow('')
    })
};

const addReview = {
    body: Joi.object().keys({
        foodId: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    })
};

module.exports = {
    createFood,
    updateFood,
    addReview
};
