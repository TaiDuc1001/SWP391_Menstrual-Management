// Configuration for API usage
export const API_CONFIG = {
    USE_MOCK_API: false, // Using real backend API
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    API_DELAY: 1000, // General API delay in milliseconds
};

// Environment-based configuration
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API service factory
export const getApiService = () => {
    return 'real';
};
