/**
 * Seed script to add buses and routes directly to MongoDB.
 * 
 * Usage: node seedData.js
 * 
 * This script connects to MongoDB using the MONGO_URI from ../.env
 * and inserts the bus and route data.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const Bus = require('./models/Bus');
const Route = require('./models/Route');

// ── Unique Routes (extracted from the bus data) ──────────────────────
const routesData = [
    { routeNo: 'EX 1-16', origin: 'Elpitiya', destination: 'Makumbura', estimatedDuration: '1h 15m' },
    { routeNo: 'EX 1-8', origin: 'Galle', destination: 'Colombo (Fort)', estimatedDuration: '1h 45m' },
    { routeNo: 'EX 1-1', origin: 'Matara', destination: 'Makumbura', estimatedDuration: '1h 30m' },
    { routeNo: 'EX 1-21', origin: 'Galle', destination: 'Kandy', estimatedDuration: '3h 30m' },
    { routeNo: 'EX 1-12', origin: 'Kataragama', destination: 'Colombo', estimatedDuration: '4h 15m' },
    { routeNo: 'EX 1-3', origin: 'Tangalle', destination: 'Makumbura', estimatedDuration: '2h 45m' },
    { routeNo: 'EX 1-42', origin: 'Galle', destination: 'Negombo', estimatedDuration: '2h 15m' },
    { routeNo: 'EX 1-5', origin: 'Ambalangoda', destination: 'Makumbura', estimatedDuration: '1h 20m' },
    { routeNo: 'EX 1-10', origin: 'Galle', destination: 'Maharagama', estimatedDuration: '1h 35m' },
    { routeNo: 'EX 1-2', origin: 'Matara', destination: 'Colombo (Fort)', estimatedDuration: '2h 10m' },
    { routeNo: 'EX 1-7', origin: 'Galle', destination: 'Kadawatha', estimatedDuration: '1h 50m' },
];

// ── All 40 Buses ─────────────────────────────────────────────────────
const busesData = [
    { busNumber: 'ND-1001', routeNo: 'EX 1-16', model: 'Isuzu MT', type: 'AC', capacity: 40 },
    { busNumber: 'ND-1002', routeNo: 'EX 1-16', model: 'Isuzu MT', type: 'AC', capacity: 40 },
    { busNumber: 'NE-2041', routeNo: 'EX 1-8', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'NE-2042', routeNo: 'EX 1-8', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'ND-5580', routeNo: 'EX 1-1', model: 'Fuso Rosa', type: 'AC', capacity: 40 },
    { busNumber: 'ND-5581', routeNo: 'EX 1-1', model: 'Fuso Rosa', type: 'AC', capacity: 40 },
    { busNumber: 'NC-7720', routeNo: 'EX 1-21', model: 'Ashok Leyland', type: 'AC', capacity: 40 },
    { busNumber: 'NC-7721', routeNo: 'EX 1-21', model: 'Ashok Leyland', type: 'AC', capacity: 40 },
    { busNumber: 'ND-4411', routeNo: 'EX 1-12', model: 'Bonluck', type: 'AC', capacity: 40 },
    { busNumber: 'ND-4412', routeNo: 'EX 1-12', model: 'Bonluck', type: 'AC', capacity: 40 },
    { busNumber: 'NE-6050', routeNo: 'EX 1-3', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'NE-6051', routeNo: 'EX 1-3', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'ND-8833', routeNo: 'EX 1-42', model: 'Mitsubishi', type: 'AC', capacity: 40 },
    { busNumber: 'ND-8834', routeNo: 'EX 1-42', model: 'Mitsubishi', type: 'AC', capacity: 40 },
    { busNumber: 'ND-1190', routeNo: 'EX 1-16', model: 'Isuzu MT', type: 'AC', capacity: 40 },
    { busNumber: 'ND-1191', routeNo: 'EX 1-16', model: 'Isuzu MT', type: 'AC', capacity: 40 },
    { busNumber: 'NE-4401', routeNo: 'EX 1-8', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'NE-4402', routeNo: 'EX 1-8', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'ND-2250', routeNo: 'EX 1-1', model: 'Fuso Rosa', type: 'AC', capacity: 40 },
    { busNumber: 'ND-2251', routeNo: 'EX 1-1', model: 'Fuso Rosa', type: 'AC', capacity: 40 },
    { busNumber: 'NC-8840', routeNo: 'EX 1-5', model: 'Ashok Leyland', type: 'AC', capacity: 40 },
    { busNumber: 'NC-8841', routeNo: 'EX 1-5', model: 'Ashok Leyland', type: 'AC', capacity: 40 },
    { busNumber: 'ND-3390', routeNo: 'EX 1-10', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'ND-3391', routeNo: 'EX 1-10', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'NE-5510', routeNo: 'EX 1-2', model: 'King Long', type: 'AC', capacity: 40 },
    { busNumber: 'NE-5511', routeNo: 'EX 1-2', model: 'King Long', type: 'AC', capacity: 40 },
    { busNumber: 'ND-9960', routeNo: 'EX 1-16', model: 'Isuzu MT', type: 'AC', capacity: 40 },
    { busNumber: 'ND-9961', routeNo: 'EX 1-16', model: 'Isuzu MT', type: 'AC', capacity: 40 },
    { busNumber: 'NC-1122', routeNo: 'EX 1-7', model: 'Fuso', type: 'AC', capacity: 40 },
    { busNumber: 'NC-1123', routeNo: 'EX 1-7', model: 'Fuso', type: 'AC', capacity: 40 },
    { busNumber: 'NE-8844', routeNo: 'EX 1-12', model: 'Bonluck', type: 'AC', capacity: 40 },
    { busNumber: 'NE-8845', routeNo: 'EX 1-12', model: 'Bonluck', type: 'AC', capacity: 40 },
    { busNumber: 'ND-6670', routeNo: 'EX 1-1', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'ND-6671', routeNo: 'EX 1-1', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'NC-4400', routeNo: 'EX 1-16', model: 'Isuzu MT', type: 'AC', capacity: 40 },
    { busNumber: 'NC-4401', routeNo: 'EX 1-16', model: 'Isuzu MT', type: 'AC', capacity: 40 },
    { busNumber: 'NE-3320', routeNo: 'EX 1-8', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'NE-3321', routeNo: 'EX 1-8', model: 'Higer', type: 'AC', capacity: 40 },
    { busNumber: 'ND-7710', routeNo: 'EX 1-10', model: 'Fuso', type: 'AC', capacity: 40 },
    { busNumber: 'ND-7711', routeNo: 'EX 1-10', model: 'Fuso', type: 'AC', capacity: 40 },
];

const seedDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI not found in .env file');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected\n');

        // ── Seed Routes ──────────────────────────────────────────
        console.log('📍 Seeding Routes...');
        let routesCreated = 0;
        let routesSkipped = 0;

        for (const routeData of routesData) {
            const exists = await Route.findOne({ routeNo: routeData.routeNo });
            if (exists) {
                console.log(`   ⏭️  Route ${routeData.routeNo} already exists — skipped`);
                routesSkipped++;
            } else {
                await Route.create(routeData);
                console.log(`   ✅ Route ${routeData.routeNo}: ${routeData.origin} → ${routeData.destination}`);
                routesCreated++;
            }
        }
        console.log(`\n   Routes: ${routesCreated} created, ${routesSkipped} skipped\n`);

        // ── Seed Buses ───────────────────────────────────────────
        console.log('🚌 Seeding Buses...');
        let busesCreated = 0;
        let busesSkipped = 0;

        for (const busData of busesData) {
            const exists = await Bus.findOne({ busNumber: busData.busNumber });
            if (exists) {
                console.log(`   ⏭️  Bus ${busData.busNumber} already exists — skipped`);
                busesSkipped++;
            } else {
                await Bus.create(busData);
                console.log(`   ✅ Bus ${busData.busNumber} (${busData.model}) on route ${busData.routeNo}`);
                busesCreated++;
            }
        }
        console.log(`\n   Buses: ${busesCreated} created, ${busesSkipped} skipped\n`);

        console.log('🎉 Seeding complete!');
        console.log(`   Total Routes: ${routesCreated} created, ${routesSkipped} skipped`);
        console.log(`   Total Buses:  ${busesCreated} created, ${busesSkipped} skipped`);

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 MongoDB disconnected');
        process.exit(0);
    }
};

seedDatabase();
