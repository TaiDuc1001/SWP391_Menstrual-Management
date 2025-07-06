// Configuration for API usage
export const API_CONFIG = {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
};

// Environment-based configuration
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
