const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createBus, getBuses, updateBus, deleteBus, toggleBusStatus,
    createRoute, getRoutes, updateRoute, deleteRoute, toggleRouteStatus,
    createSchedule, getSchedules, updateSchedule, deleteSchedule,
    getAnalytics, getScheduleSeats,
} = require('../controllers/adminController');

const {
    getAdminBookings,
    cancelAdminBooking
} = require('../controllers/bookingController');

// All routes protected by auth + admin middleware
router.use(protect);
router.use(admin);

// Analytics
router.get('/analytics', getAnalytics);

// Bus routes
router.route('/buses')
    .get(getBuses)
    .post(createBus);

router.route('/buses/:id')
    .put(updateBus)
    .delete(deleteBus);

router.put('/buses/:id/toggle', toggleBusStatus);

// Route routes
router.route('/routes')
    .get(getRoutes)
    .post(createRoute);

router.route('/routes/:id')
    .put(updateRoute)
    .delete(deleteRoute);

router.put('/routes/:id/toggle', toggleRouteStatus);

// Schedules
router.route('/schedules')
    .get(getSchedules)
    .post(createSchedule);

router.route('/schedules/:id')
    .put(updateSchedule)
    .delete(deleteSchedule);

router.get('/schedules/:id/seats', getScheduleSeats);

// Bookings Management
router.route('/bookings')
    .get(getAdminBookings);

router.route('/bookings/:id/cancel')
    .put(cancelAdminBooking);

module.exports = router;
