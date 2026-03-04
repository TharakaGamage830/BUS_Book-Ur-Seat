const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: '../.env' }); // Adjust if .env is at root

const verifyDemoUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');

        const user = await User.findOneAndUpdate(
            { email: 'passenger@bus.com' },
            { isVerified: true },
            { new: true }
        );

        if (user) {
            console.log('Test passenger verified successfully!\n!');
            console.log('-----------------------------------');
            console.log('You can now log in as a regular passenger with:');
            console.log('Email: passenger@bus.com');
            console.log('Password: password123');
            console.log('-----------------------------------');
        } else {
            console.log('Passenger not found. Creating directly...');
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);

            await User.create({
                name: 'Test Passenger',
                email: 'passenger@bus.com',
                password: hashedPassword,
                isVerified: true
            });
            console.log('Test passenger created and verified successfully!\n!');
            console.log('-----------------------------------');
            console.log('You can now log in as a regular passenger with:');
            console.log('Email: passenger@bus.com');
            console.log('Password: password123');
            console.log('-----------------------------------');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyDemoUser();
