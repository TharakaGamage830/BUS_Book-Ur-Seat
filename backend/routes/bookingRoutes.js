const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getActiveSchedules,
    getBookedSeats,
    createBooking,
    getMyBookings,
    cancelMyBooking,
    confirmParticipation,
    submitRating
} = require('../controllers/bookingController');

// Public routes
router.get('/schedules', getActiveSchedules);
router.get('/schedules/:id/seats', getBookedSeats);

// Protected routes (require user to be logged in)
router.use(protect);
router.post('/', createBooking);
router.get('/mybookings', getMyBookings);
router.put('/:id/cancel', cancelMyBooking);
router.put('/:id/participate', confirmParticipation);
router.put('/:id/rate', submitRating);

module.exports = router;
