const express = require('express'); // Server entry point
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const orderRoutes = require('./routes/order.routes');


const app = express();

// Security Middlewares
app.use(helmet()); // Secure HTTP Headers

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs (adjusted for dev usage)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', require('./routes/delivery.routes'));

// Send 404 error for any unknown api request
app.use((req, res, next) => {
    const httpStatus = require('http-status');
    const ApiError = require('./utils/ApiError');
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

const { errorConverter, errorHandler } = require('./middlewares/error');

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
