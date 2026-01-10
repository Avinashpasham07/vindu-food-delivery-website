const Joi = require('joi');

const userRegister = {
    body: Joi.object().keys({
        fullname: Joi.string().required().min(3),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        phone: Joi.string().required(),
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
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        phone: Joi.string().required(),
        contactName: Joi.string().allow('', null),
        address: Joi.string().allow('', null),
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
