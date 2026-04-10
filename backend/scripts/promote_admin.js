const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../src/models/user.model');

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address: node promote_admin.js your@email.com');
    process.exit(1);
}

const promote = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully.');

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.error(`User with email ${email} not found.`);
        } else {
            console.log(`SUCCESS: User ${user.fullname} (${user.email}) promoted to ADMIN.`);
        }

    } catch (error) {
        console.error('ERROR:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

promote();
