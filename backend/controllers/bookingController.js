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

        // Anti-rebook: check if user previously cancelled on this schedule
        const previousCancel = await Booking.findOne({
            user: userId,
            schedule: scheduleId,
            status: 'cancelled'
        });
        if (previousCancel) {
            return res.status(400).json({ message: 'You have previously cancelled a booking on this bus. You cannot rebook on the same trip.' });
        }

        // Limit user to 1 booking per schedule
        const existingBooking = await Booking.findOne({
            user: userId,
            schedule: scheduleId,
            status: 'confirmed'
        });
        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked a seat on this trip. Only one seat per user is allowed.' });
        }

        // Check if seat is already booked
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

// @desc    User cancels their own booking (24h rule)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelMyBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'schedule',
            select: 'departureTime'
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Must be the booking owner
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // 24-hour rule: departure must be > 24h from now
        const now = new Date();
        const departure = new Date(booking.schedule.departureTime);
        const hoursUntilDeparture = (departure - now) / (1000 * 60 * 60);

        if (hoursUntilDeparture < 24) {
            return res.status(400).json({
                message: 'Cannot cancel within 24 hours of departure. Cancellation deadline has passed.'
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAdminBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email')
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

// @desc    Cancel/Update a booking status (Admin)
// @route   PUT /api/admin/bookings/:id/cancel
// @access  Private/Admin
const cancelAdminBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Passenger confirms participation
// @route   PUT /api/bookings/:id/participate
// @access  Private
const confirmParticipation = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.participated = true;
        await booking.save();
        res.json({ message: 'Participation confirmed', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Passenger submits a rating
// @route   PUT /api/bookings/:id/rate
// @access  Private
const submitRating = async (req, res) => {
    try {
        const { rating } = req.body;
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (!booking.participated) {
            return res.status(400).json({ message: 'Please confirm participation first' });
        }

        booking.rating = rating;
        await booking.save();
        res.json({ message: 'Rating submitted', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getActiveSchedules,
    getBookedSeats,
    createBooking,
    getMyBookings,
    cancelMyBooking,
    getAdminBookings,
    cancelAdminBooking,
    confirmParticipation,
    submitRating
};
