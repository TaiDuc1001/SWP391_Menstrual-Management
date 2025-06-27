import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

interface AppWithProvidersProps {
    children: React.ReactNode;
}

const AppWithProviders: React.FC<AppWithProvidersProps> = ({ children }) => {
    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
};

export default AppWithProviders;
