import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * - baseURL points to the Vite proxy (/api → http://localhost:5000/api)
 * - Interceptor automatically attaches the JWT token from localStorage
 */
const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
