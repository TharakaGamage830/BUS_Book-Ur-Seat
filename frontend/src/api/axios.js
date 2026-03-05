import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request: attach token
api.interceptors.request.use(
    (config) => {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (e) {
                console.error('Failed parsing user token', e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response: auto-logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Don't logout on login/register 401 (wrong password)
            const url = error.config?.url || '';
            if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
                localStorage.removeItem('user');
                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
