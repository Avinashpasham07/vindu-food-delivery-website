const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof Number ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Convert to number if it's not
    statusCode = Number(statusCode);

    // Joi/Validation Error Handling
    if (err.isJoi) {
        statusCode = 400; // Bad Request
    }

    // if (!err.isOperational && process.env.NODE_ENV === 'production') {
    //     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    //     message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    // }

    // Ultimate fallback if statusCode is invalid (NaN, 0, undefined, null)
    if (!statusCode || isNaN(statusCode)) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR || 500;
        message = message || "Internal Server Error";
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'development') {
        logger.error(err.stack);
    } else {
        logger.error(err.message);
    }

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorHandler,
};
