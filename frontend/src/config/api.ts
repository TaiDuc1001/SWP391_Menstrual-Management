// Configuration for API usage
export const API_CONFIG = {
    USE_MOCK_API: true, // Set to false when backend is ready
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    MOCK_API_DELAY: 1000, // Simulate API delay in milliseconds
};

// Environment-based configuration
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API service factory
export const getApiService = () => {
    return API_CONFIG.USE_MOCK_API ? 'mock' : 'real';
};
