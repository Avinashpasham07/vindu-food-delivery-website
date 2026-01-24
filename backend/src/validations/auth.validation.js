const Joi = require('joi');

const register = {
    body: Joi.object().keys({
        fullname: Joi.string().required().min(2).max(50),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8)
            .pattern(new RegExp('^[a-zA-Z0-9@#$%^&+=]*$'))
            .message('Password must contain only alphanumeric characters and @#$%^&+=')
            .custom((value, helpers) => {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    return helpers.message('Password must contain at least one letter and one number');
                }
                return value;
            }),
        phone: Joi.string().pattern(/^[0-9]{10}$/).message('Phone number must be 10 digits').required()
    })
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
};

const logout = {
    body: Joi.object().keys({})
};

module.exports = {
    register,
    login,
    logout
};
