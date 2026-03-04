const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('./models/User');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');

        // Find the user created by the human
        const user = await User.findOne();
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`Successfully made ${user.email} an admin!`);
        } else {
            console.log('No users found in database to make admin.');
        }

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

makeAdmin();
