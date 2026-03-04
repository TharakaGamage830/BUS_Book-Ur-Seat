import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend base URL
});

// Request Interceptor: Add auth token
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
                console.error("Failed parsing user token", e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// We can add response interceptors to handle global 401 token invalidation here if needed later

export default api;
