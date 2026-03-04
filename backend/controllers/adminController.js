const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');

// @desc    Create a new Bus
// @route   POST /api/admin/buses
// @access  Private/Admin
const createBus = async (req, res) => {
    try {
        const { busNumber, capacity, type } = req.body;

        const busExists = await Bus.findOne({ busNumber });
        if (busExists) {
            return res.status(400).json({ message: 'Bus number already exists' });
        }

        const bus = await Bus.create({
            busNumber,
            capacity,
            type
        });

        res.status(201).json(bus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all Buses
// @route   GET /api/admin/buses
// @access  Private/Admin
const getBuses = async (req, res) => {
    try {
        const buses = await Bus.find({});
        res.json(buses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new Route
// @route   POST /api/admin/routes
// @access  Private/Admin
const createRoute = async (req, res) => {
    try {
        const { origin, destination, distance, estimatedDuration } = req.body;

        const routeExists = await Route.findOne({ origin, destination });
        if (routeExists) {
            return res.status(400).json({ message: 'Route already exists' });
        }

        const route = await Route.create({
            origin,
            destination,
            distance,
            estimatedDuration
        });

        res.status(201).json(route);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all Routes
// @route   GET /api/admin/routes
// @access  Private/Admin
const getRoutes = async (req, res) => {
    try {
        const routes = await Route.find({});
        res.json(routes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new Schedule
// @route   POST /api/admin/schedules
// @access  Private/Admin
const createSchedule = async (req, res) => {
    try {
        const { bus, route, departureTime, arrivalTime, price } = req.body;

        // Ensure bus exists
        const busExists = await Bus.findById(bus);
        if (!busExists) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Ensure route exists
        const routeExists = await Route.findById(route);
        if (!routeExists) {
            return res.status(404).json({ message: 'Route not found' });
        }

        const schedule = await Schedule.create({
            bus,
            route,
            departureTime,
            arrivalTime,
            price
        });

        // Populate to return the full details in response
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
// @access  Private/Admin
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

module.exports = {
    createBus,
    getBuses,
    createRoute,
    getRoutes,
    createSchedule,
    getSchedules
};
