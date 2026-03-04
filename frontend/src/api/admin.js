import api from './axios';

// --- Buses ---
export const getBuses = async () => {
    const { data } = await api.get('/admin/buses');
    return data;
};

export const createBus = async (busData) => {
    const { data } = await api.post('/admin/buses', busData);
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

// --- Schedules ---
export const getSchedules = async () => {
    const { data } = await api.get('/admin/schedules');
    return data;
};

export const createSchedule = async (scheduleData) => {
    const { data } = await api.post('/admin/schedules', scheduleData);
    return data;
};
