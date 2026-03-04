const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
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
