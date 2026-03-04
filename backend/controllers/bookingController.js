const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

// @desc    Get all active schedules (Public search)
// @route   GET /api/bookings/schedules
// @access  Public
const getActiveSchedules = async (req, res) => {
    try {
        const { origin, destination, date } = req.query;

        // Base query for future scheduled buses
        let query = { status: 'scheduled', departureTime: { $gte: new Date() } };

        // We can add filtering logic here, but since 'origin' and 'destination' are on the Route model,
        // we populate the route and filter in memory, or we can use an aggregation pipeline.
        // For simplicity, fetch populated schedules and filter array in JavaScript if params exist.

        let schedules = await Schedule.find(query)
            .populate('bus', 'busNumber type capacity')
            .populate('route', 'origin destination estimatedDurationdistance'); // 'distance' removed typo

        // Filtering by query parameters if provided
        if (origin || destination || date) {
            schedules = schedules.filter(sch => {
                let matchesOrigin = true;
                let matchesDestination = true;
                let matchesDate = true;

                if (origin && origin.trim() !== '') {
                    matchesOrigin = sch.route.origin.toLowerCase().includes(origin.toLowerCase());
                }

                if (destination && destination.trim() !== '') {
                    matchesDestination = sch.route.destination.toLowerCase().includes(destination.toLowerCase());
                }

                if (date && date.trim() !== '') {
                    const schDate = new Date(sch.departureTime).toISOString().split('T')[0];
                    matchesDate = schDate === date;
                }

                return matchesOrigin && matchesDestination && matchesDate;
            });
        }

        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get booked seats for a specific schedule
// @route   GET /api/bookings/schedules/:id/seats
// @access  Public
const getBookedSeats = async (req, res) => {
    try {
        const scheduleId = req.params.id;

        const schedule = await Schedule.findById(scheduleId)
            .populate('bus', 'capacity type')
            .populate('route', 'origin destination');

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        const bookings = await Booking.find({ schedule: scheduleId, status: 'confirmed' }).select('seatNumber user');

        // Return array of booked seat numbers
        const bookedSeats = bookings.map(b => b.seatNumber);

        res.json({
            schedule: {
                _id: schedule._id,
                price: schedule.price,
                departureTime: schedule.departureTime,
                route: schedule.route,
                busType: schedule.bus.type
            },
            capacity: schedule.bus.capacity,
            bookedSeats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { scheduleId, seatNumber, passengerDetails } = req.body;
        const userId = req.user._id;

        const schedule = await Schedule.findById(scheduleId).populate('bus');
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Validate seat number limit
        if (seatNumber < 1 || seatNumber > schedule.bus.capacity) {
            return res.status(400).json({ message: 'Invalid seat number' });
        }

        // Check if seat is already booked (just in case the unique index gets surpassed or race condition)
        const seatExists = await Booking.findOne({ schedule: scheduleId, seatNumber, status: 'confirmed' });
        if (seatExists) {
            return res.status(400).json({ message: 'Seat is already booked' });
        }

        const booking = await Booking.create({
            user: userId,
            schedule: scheduleId,
            seatNumber,
            passengerDetails
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Seat is currently unavailable. Prevented double booking.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'schedule',
                populate: [
                    { path: 'route', select: 'origin destination' },
                    { path: 'bus', select: 'busNumber type' }
                ]
            })
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getActiveSchedules,
    getBookedSeats,
    createBooking,
    getMyBookings
};
