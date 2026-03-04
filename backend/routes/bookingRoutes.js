const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getActiveSchedules,
    getBookedSeats,
    createBooking,
    getMyBookings
} = require('../controllers/bookingController');

// Public routes
router.get('/schedules', getActiveSchedules);
router.get('/schedules/:id/seats', getBookedSeats);

// Protected routes (require user to be logged in)
router.use(protect);
router.post('/', createBooking);
router.get('/mybookings', getMyBookings);

module.exports = router;
