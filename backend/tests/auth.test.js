const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

// Mock Mongoose connection to avoid actual DB writes if we want purely unit tests, 
// OR use a test DB. For this smoke test, we'll assume we can hit the app.
// Ideally usage of 'mongodb-memory-server' is best but that takes more install.
// We will just skip DB connection dependent tests for now or mock the controller.

describe('Auth Endpoints', () => {

    it('should return 400 if user registration data is invalid', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({
                fullname: 'Te', // too short
                email: 'invalid-email',
                password: '123'
            });
        expect(res.statusCode).toEqual(400);
        // Expect Joi error message structure
        // We configured Joi to return message in ApiError
        expect(res.body.message).toBeDefined();
    });

    // More tests would go here
});
