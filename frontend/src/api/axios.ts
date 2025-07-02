import axios from 'axios';

const url = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const api = axios.create({
    baseURL: url,
});

// Add request interceptor to include auth token and customer ID
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add customer ID for authenticated requests
        try {
            const userProfile = localStorage.getItem('userProfile');
            if (userProfile) {
                const parsed = JSON.parse(userProfile);
                if (parsed.role === 'CUSTOMER' && parsed.profile?.id) {
                    config.headers['X-Customer-ID'] = parsed.profile.id.toString();
                }
            }
        } catch (error) {
            console.warn('Failed to parse user profile for customer ID:', error);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
