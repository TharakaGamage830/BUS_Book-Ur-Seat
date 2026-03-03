import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const routes = [
    { from: 'Colombo', to: 'Kandy' },
    { from: 'Colombo', to: 'Galle' },
    { from: 'Kandy', to: 'Jaffna' },
    { from: 'Colombo', to: 'Matara' },
    { from: 'Galle', to: 'Matara' },
]

function getNextDays(count: number): string[] {
    const days: string[] = []
    for (let i = 0; i < count; i++) {
        const d = new Date()
        d.setDate(d.getDate() + i)
        days.push(d.toISOString().split('T')[0])
    }
    return days
}

const scheduleTemplates = [
    { departureTime: '06:00', arrivalTime: '09:30', busNumber: 'BUS-001' },
    { departureTime: '09:00', arrivalTime: '12:30', busNumber: 'BUS-002' },
    { departureTime: '13:00', arrivalTime: '16:30', busNumber: 'BUS-003' },
    { departureTime: '17:00', arrivalTime: '20:30', busNumber: 'BUS-004' },
]

function generateSeatNumbers(total: number): string[] {
    const seats: string[] = []
    const rows = Math.ceil(total / 4)
    const letters = ['A', 'B', 'C', 'D']
    for (let r = 1; r <= rows; r++) {
        for (const l of letters) {
            if (seats.length < total) seats.push(`${r}${l}`)
        }
    }
    return seats
}

function generateBookingRef(): string {
    return 'BUS-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

async function main() {
    console.log('🌱 Seeding database...')

    // Clean up
    await prisma.booking.deleteMany()
    await prisma.seat.deleteMany()
    await prisma.schedule.deleteMany()
    await prisma.route.deleteMany()
    await prisma.admin.deleteMany()

    // Create admin
    const hashed = await bcrypt.hash('admin123', 10)
    await prisma.admin.create({
        data: { username: 'admin', password: hashed },
    })
    console.log('✅ Admin created: admin / admin123')

    // Create routes
    const days = getNextDays(7)
    const seatNums = generateSeatNumbers(40)

    for (const routeData of routes) {
        const route = await prisma.route.create({ data: routeData })

        for (const day of days) {
            for (const tmpl of scheduleTemplates) {
                const schedule = await prisma.schedule.create({
                    data: {
                        routeId: route.id,
                        date: day,
                        departureTime: tmpl.departureTime,
                        arrivalTime: tmpl.arrivalTime,
                        busNumber: tmpl.busNumber,
                        totalSeats: 40,
                    },
                })

                // Create 40 seats
                await prisma.seat.createMany({
                    data: seatNums.map((num) => ({
                        scheduleId: schedule.id,
                        seatNumber: num,
                        status: 'available',
                    })),
                })

                // Randomly book 3-8 seats per schedule for demo
                const bookedCount = Math.floor(Math.random() * 6) + 3
                const toBook = seatNums.slice(0, bookedCount)
                const seats = await prisma.seat.findMany({
                    where: { scheduleId: schedule.id, seatNumber: { in: toBook } },
                })

                for (const seat of seats) {
                    const ref = generateBookingRef()
                    await prisma.seat.update({ where: { id: seat.id }, data: { status: 'booked' } })
                    await prisma.booking.create({
                        data: {
                            bookingRef: ref,
                            scheduleId: schedule.id,
                            seatId: seat.id,
                            passengerName: 'Sample Passenger',
                            phone: '0771234567',
                            status: 'confirmed',
                        },
                    })
                }
            }
        }
        console.log(`✅ Route: ${routeData.from} → ${routeData.to} with schedules`)
    }

    console.log('✅ Seeding complete!')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })
