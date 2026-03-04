import api from './axios';

// Get active public schedules, with optional search params
export const searchSchedules = async (params) => {
    // params can include origin, destination, date
    const { data } = await api.get('/bookings/schedules', { params });
    return data;
};

// Get booked seats array and total capacity for a given schedule
export const getScheduleSeats = async (scheduleId) => {
    const { data } = await api.get(`/bookings/schedules/${scheduleId}/seats`);
    return data;
};

// Create a new booking
export const createBooking = async (bookingData) => {
    // bookingData: { scheduleId, seatNumber, passengerDetails: { name, phone } }
    const { data } = await api.post('/bookings', bookingData);
    return data;
};

// Get user's personal booking history
export const getMyBookings = async () => {
    const { data } = await api.get('/bookings/mybookings');
    return data;
};
