const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: [true, 'Please add a bus number (e.g., WP-1234)'],
        unique: true,
    },
    model: {
        type: String, // e.g., "Isuzu MT", "Higer", "Fuso Rosa"
    },
    routeNo: {
        type: String, // e.g., "EX 1-16"
    },
    capacity: {
        type: Number,
        required: [true, 'Please add bus capacity'],
        default: 40,
    },
    type: {
        type: String,
        enum: ['Normal (Non AC)', 'Semi Luxury (Non AC)', 'Luxury (AC)', 'Super Luxury (AC)'],
        default: 'Normal (Non AC)',
    },
    layoutParams: {
        backRowSeats: { type: Number, default: 5 },
        leftRowSeats: { type: Number, default: 2 },
        rightRowSeats: { type: Number, default: 2 },
    },
    layout: {
        type: Array, // Stores the exact customized layout saved by admin
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bus', busSchema);
