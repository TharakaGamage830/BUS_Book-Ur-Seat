const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeNo: {
        type: String, // e.g., "EX 1-16"
        unique: true,
    },
    origin: {
        type: String,
        required: [true, 'Please add a starting point / origin'],
    },
    destination: {
        type: String,
        required: [true, 'Please add a destination'],
    },
    distance: {
        type: Number, // in km
    },
    estimatedDuration: {
        type: String, // e.g., "5 hours"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
