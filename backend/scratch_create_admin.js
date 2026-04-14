const mongoose = require('mongoose');
const usermodel = require('./src/models/user.model');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const email = 'admin@vindu.com';
        const password = 'adminpassword';
        
        const existingAdmin = await usermodel.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists. Updating role to admin...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin updated successfully.');
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = new usermodel({
                fullname: 'Vindu Admin',
                email: email,
                password: hashedPassword,
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Admin created successfully.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

createAdmin();
