const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user']
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: [true, 'Booking must be associated with a schedule']
    },
    seatNumber: {
        type: Number,
        required: [true, 'Please provide a seat number']
    },
    passengerDetails: {
        name: {
            type: String,
            required: [true, 'Passenger name is required']
        },
        phone: {
            type: String,
            required: [true, 'Passenger phone is required']
        }
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    participated: {
        type: Boolean,
        default: null
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    paymentId: {
        type: String,
        default: 'cash-on-boarding'
    }
}, {
    timestamps: true
});

// Compound index to prevent double booking the same seat on the same schedule
bookingSchema.index({ schedule: 1, seatNumber: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'confirmed' } });

module.exports = mongoose.model('Booking', bookingSchema);
