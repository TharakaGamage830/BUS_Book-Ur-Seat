const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const Booking = require('../models/Booking');

// ============================================================
// BUSES
// ============================================================

// @desc    Create a new Bus
// @route   POST /api/admin/buses
const createBus = async (req, res) => {
    try {
        const { busNumber, capacity, type, model, routeNo, layoutParams, layout } = req.body;
        const busExists = await Bus.findOne({ busNumber });
        if (busExists) return res.status(400).json({ message: 'Bus number already exists' });
        const bus = await Bus.create({ busNumber, capacity, type, model, routeNo, layoutParams, layout });
        res.status(201).json(bus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all Buses
// @route   GET /api/admin/buses
const getBuses = async (req, res) => {
    try {
        const buses = await Bus.find({});
        res.json(buses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a Bus
// @route   PUT /api/admin/buses/:id
const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json(bus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a Bus
// @route   DELETE /api/admin/buses/:id
const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json({ message: 'Bus removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle Bus active status
// @route   PUT /api/admin/buses/:id/toggle
const toggleBusStatus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });

        const updatedBus = await Bus.findByIdAndUpdate(
            req.params.id,
            { isActive: !bus.isActive },
            { new: true }
        );
        res.json(updatedBus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ============================================================
// ROUTES
// ============================================================

// @desc    Create a new Route
// @route   POST /api/admin/routes
const createRoute = async (req, res) => {
    try {
        const { routeNo, origin, destination, distance, estimatedDuration } = req.body;
        const routeExists = await Route.findOne({ routeNo });
        if (routeExists) return res.status(400).json({ message: 'Route already exists' });
        const route = await Route.create({ routeNo, origin, destination, distance, estimatedDuration });
        res.status(201).json(route);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all Routes
// @route   GET /api/admin/routes
const getRoutes = async (req, res) => {
    try {
        const routes = await Route.find({});
        res.json(routes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a Route
// @route   PUT /api/admin/routes/:id
const updateRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json(route);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a Route
// @route   DELETE /api/admin/routes/:id
const deleteRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndDelete(req.params.id);
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json({ message: 'Route removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle Route active status
// @route   PUT /api/admin/routes/:id/toggle
const toggleRouteStatus = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).json({ message: 'Route not found' });

        const updatedRoute = await Route.findByIdAndUpdate(
            req.params.id,
            { isActive: !route.isActive },
            { new: true }
        );
        res.json(updatedRoute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ============================================================
// SCHEDULES
// ============================================================

// @desc    Create a new Schedule
// @route   POST /api/admin/schedules
const createSchedule = async (req, res) => {
    try {
        const { bus, route, departureTime, arrivalTime, price } = req.body;
        const busExists = await Bus.findById(bus);
        if (!busExists) return res.status(404).json({ message: 'Bus not found' });
        const routeExists = await Route.findById(route);
        if (!routeExists) return res.status(404).json({ message: 'Route not found' });
        const schedule = await Schedule.create({ bus, route, departureTime, arrivalTime, price });
        const populatedSchedule = await Schedule.findById(schedule._id)
            .populate('bus', 'busNumber type capacity')
            .populate('route', 'origin destination distance');
        res.status(201).json(populatedSchedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all Schedules
// @route   GET /api/admin/schedules
const getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find({})
            .populate('bus', 'busNumber type capacity')
            .populate('route', 'origin destination estimatedDuration');
        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a Schedule
// @route   PUT /api/admin/schedules/:id
const updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('bus', 'busNumber type capacity')
            .populate('route', 'origin destination estimatedDuration');
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a Schedule
// @route   DELETE /api/admin/schedules/:id
const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        res.json({ message: 'Schedule removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ============================================================
// ANALYTICS
// ============================================================

// @desc    Get admin analytics stats + chart data
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res) => {
    try {
        const [totalBuses, activeBuses, totalRoutes, activeRoutes, totalSchedules, totalBookings, confirmedBookings, cancelledBookings] = await Promise.all([
            Bus.countDocuments(),
            Bus.countDocuments({ isActive: true }),
            Route.countDocuments(),
            Route.countDocuments({ isActive: true }),
            Schedule.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'confirmed' }),
            Booking.countDocuments({ status: 'cancelled' }),
        ]);

        // Total revenue from confirmed bookings
        const revenueResult = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $lookup: { from: 'schedules', localField: 'schedule', foreignField: '_id', as: 'scheduleData' } },
            { $unwind: '$scheduleData' },
            { $group: { _id: null, total: { $sum: '$scheduleData.price' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Recent bookings
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({ path: 'schedule', populate: { path: 'route', select: 'origin destination' } })
            .populate('user', 'name email');

        // --- CHART DATA ---

        // 1. Bookings per day (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const bookingsPerDay = await Booking.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing days with 0
        const dailyBookings = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().split('T')[0];
            const found = bookingsPerDay.find(b => b._id === key);
            dailyBookings.push({
                date: key,
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                count: found ? found.count : 0
            });
        }

        // 2. Revenue by route (top 5)
        const revenueByRoute = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $lookup: { from: 'schedules', localField: 'schedule', foreignField: '_id', as: 'sch' } },
            { $unwind: '$sch' },
            { $lookup: { from: 'routes', localField: 'sch.route', foreignField: '_id', as: 'rt' } },
            { $unwind: '$rt' },
            {
                $group: {
                    _id: '$rt._id',
                    route: { $first: { $concat: ['$rt.origin', ' → ', '$rt.destination'] } },
                    revenue: { $sum: '$sch.price' },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);

        // 3. Bus utilization (per active scheduled bus)
        const busUtilization = await Schedule.aggregate([
            { $match: { status: 'scheduled' } },
            { $lookup: { from: 'buses', localField: 'bus', foreignField: '_id', as: 'busData' } },
            { $unwind: '$busData' },
            { $lookup: { from: 'bookings', localField: '_id', foreignField: 'schedule', as: 'bookings' } },
            {
                $project: {
                    busNumber: '$busData.busNumber',
                    busType: '$busData.type',
                    capacity: '$busData.capacity',
                    booked: {
                        $size: {
                            $filter: { input: '$bookings', as: 'b', cond: { $eq: ['$$b.status', 'confirmed'] } }
                        }
                    },
                    route: 1, departureTime: 1
                }
            },
            { $lookup: { from: 'routes', localField: 'route', foreignField: '_id', as: 'routeData' } },
            { $unwind: '$routeData' },
            {
                $project: {
                    busNumber: 1, busType: 1, capacity: 1, booked: 1,
                    route: { $concat: ['$routeData.origin', ' → ', '$routeData.destination'] },
                    departureTime: 1
                }
            },
            { $sort: { departureTime: 1 } },
            { $limit: 8 }
        ]);

        // 4. Booking status breakdown
        const statusBreakdown = { confirmed: confirmedBookings, cancelled: cancelledBookings, pending: totalBookings - confirmedBookings - cancelledBookings };

        res.json({
            totalBuses, activeBuses,
            totalRoutes, activeRoutes,
            totalSchedules,
            totalBookings, confirmedBookings, cancelledBookings,
            totalRevenue,
            recentBookings,
            // Chart data
            dailyBookings,
            revenueByRoute,
            busUtilization,
            statusBreakdown,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get booked seats for a schedule (admin)
// @route   GET /api/admin/schedules/:id/seats
const getScheduleSeats = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate('bus', 'busNumber capacity type')
            .populate('route', 'origin destination');
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

        const bookings = await Booking.find({ schedule: req.params.id, status: 'confirmed' })
            .populate('user', 'name email')
            .select('seatNumber user');

        res.json({
            schedule,
            capacity: schedule.bus?.capacity || 0,
            bookedSeats: bookings.map(b => b.seatNumber),
            bookingDetails: bookings.map(b => ({
                seat: b.seatNumber,
                passenger: b.user?.name || 'Unknown',
                email: b.user?.email || ''
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createBus, getBuses, updateBus, deleteBus, toggleBusStatus,
    createRoute, getRoutes, updateRoute, deleteRoute, toggleRouteStatus,
    createSchedule, getSchedules, updateSchedule, deleteSchedule,
    getAnalytics, getScheduleSeats,
};
