const Joi = require('joi');

const userRegister = {
    body: Joi.object().keys({
        fullname: Joi.string().required().min(3),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
    }),
};

const userLogin = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
};

const foodPartnerRegister = {
    body: Joi.object().keys({
        fullname: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        phone: Joi.string().required(),
        role: Joi.string().default('foodPartner'),
    }),
};

const foodPartnerLogin = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
};

module.exports = {
    userRegister,
    userLogin,
    foodPartnerRegister,
    foodPartnerLogin
};
