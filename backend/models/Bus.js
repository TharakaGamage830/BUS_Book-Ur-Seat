const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: [true, 'Please add a bus number (e.g., WP-1234)'],
        unique: true,
    },
    capacity: {
        type: Number,
        required: [true, 'Please add bus capacity'],
        default: 40,
    },
    type: {
        type: String,
        enum: ['AC', 'Non-AC', 'Luxury', 'Sleeper'],
        default: 'AC',
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bus', busSchema);
