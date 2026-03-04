const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');

        const email = 'admin@bus.com';
        const password = 'password123';

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: 'System Admin',
                email,
                password,
                role: 'admin',
                isVerified: true
            });
            console.log('Admin user created successfully!');
        } else {
            user.role = 'admin';
            user.isVerified = true;
            await user.save();
            console.log('Admin user already exists, privileges ensured!');
        }

        console.log('-----------------------------------');
        console.log('You can now log in with:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedAdmin();
