const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createBus,
    getBuses,
    createRoute,
    getRoutes,
    createSchedule,
    getSchedules
} = require('../controllers/adminController');

// All routes in this file are protected by auth and admin middleware
router.use(protect);
router.use(admin);

// Bus routes
router.route('/buses')
    .post(createBus)
    .get(getBuses);

// Route routes
router.route('/routes')
    .post(createRoute)
    .get(getRoutes);

// Schedule routes
router.route('/schedules')
    .post(createSchedule)
    .get(getSchedules);

module.exports = router;
