import api from './axios';

// --- Analytics ---
export const getAnalytics = async () => {
    const { data } = await api.get('/admin/analytics');
    return data;
};

// --- Buses ---
export const getBuses = async () => {
    const { data } = await api.get('/admin/buses');
    return data;
};

export const createBus = async (busData) => {
    const { data } = await api.post('/admin/buses', busData);
    return data;
};

export const updateBus = async (id, busData) => {
    const { data } = await api.put(`/admin/buses/${id}`, busData);
    return data;
};

export const deleteBus = async (id) => {
    const { data } = await api.delete(`/admin/buses/${id}`);
    return data;
};

export const toggleBusStatus = async (id) => {
    const { data } = await api.put(`/admin/buses/${id}/toggle`);
    return data;
};

// --- Routes ---
export const getRoutes = async () => {
    const { data } = await api.get('/admin/routes');
    return data;
};

export const createRoute = async (routeData) => {
    const { data } = await api.post('/admin/routes', routeData);
    return data;
};

export const updateRoute = async (id, routeData) => {
    const { data } = await api.put(`/admin/routes/${id}`, routeData);
    return data;
};

export const deleteRoute = async (id) => {
    const { data } = await api.delete(`/admin/routes/${id}`);
    return data;
};

export const toggleRouteStatus = async (id) => {
    const { data } = await api.put(`/admin/routes/${id}/toggle`);
    return data;
};

// --- Schedules ---
export const getSchedules = async () => {
    const { data } = await api.get('/admin/schedules');
    return data;
};

export const createSchedule = async (scheduleData) => {
    const { data } = await api.post('/admin/schedules', scheduleData);
    return data;
};

export const updateSchedule = async (id, scheduleData) => {
    const { data } = await api.put(`/admin/schedules/${id}`, scheduleData);
    return data;
};

export const deleteSchedule = async (id) => {
    const { data } = await api.delete(`/admin/schedules/${id}`);
    return data;
};

export const getScheduleSeats = async (id) => {
    const { data } = await api.get(`/admin/schedules/${id}/seats`);
    return data;
};

// --- Bookings Management ---
export const getAdminBookings = async () => {
    const { data } = await api.get('/admin/bookings');
    return data;
};

export const cancelBooking = async (bookingId) => {
    const { data } = await api.put(`/admin/bookings/${bookingId}/cancel`);
    return data;
};
