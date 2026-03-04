const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: [true, 'Schedule must be associated with a Bus']
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: [true, 'Schedule must be associated with a Route']
    },
    departureTime: {
        type: Date,
        required: [true, 'Please provide a departure time']
    },
    arrivalTime: {
        type: Date,
        required: [true, 'Please provide an estimated arrival time']
    },
    price: {
        type: Number,
        required: [true, 'Please set a base price for this schedule']
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-transit', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);
