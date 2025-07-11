import axios from 'axios';

const url = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const api = axios.create({
    baseURL: url,
});

// Add request interceptor to include auth token and user ID
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add user ID for authenticated requests based on role
        try {
            const userProfile = localStorage.getItem('userProfile');
            if (userProfile) {
                const parsed = JSON.parse(userProfile);
                console.log('Axios interceptor - parsed user profile:', parsed);
                
                if (parsed.profile?.id) {
                    // Add role-specific headers
                    if (parsed.role === 'CUSTOMER') {
                        config.headers['X-Customer-ID'] = parsed.profile.id.toString();
                        console.log('Added X-Customer-ID header:', parsed.profile.id);
                    } else if (parsed.role === 'DOCTOR') {
                        config.headers['X-Doctor-ID'] = parsed.profile.id.toString();
                        console.log('Added X-Doctor-ID header:', parsed.profile.id);
                    }
                    
                    // Also add generic user ID header for backward compatibility
                    config.headers['X-User-ID'] = parsed.profile.id.toString();
                    console.log('Added X-User-ID header:', parsed.profile.id);
                } else {
                    console.log('Axios interceptor - no profile ID found in user profile');
                }
            } else {
                console.log('Axios interceptor - no user profile found in localStorage');
            }
        } catch (error) {
            console.warn('Failed to parse user profile for user ID:', error);
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
