import React, {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import AppRouter from './AppRouter';
import { NotificationProvider } from './context/NotificationContext';
import { clearAuthenticationData } from './utils/auth';

function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [role, setRole] = React.useState<string | null>(null);


    useEffect(() => {
        const savedRole = localStorage.getItem('role');
        if (savedRole) {
            setIsAuthenticated(true);
            setRole(savedRole.toLowerCase());
        }
    }, []);

    const handleLogin = (userRole: string) => {
        const lowerRole = userRole.toLowerCase();
        setIsAuthenticated(true);
        setRole(lowerRole);
        localStorage.setItem('role', lowerRole);
    };
    const handleAuthToggle = () => {
        setIsAuthenticated(false);
        setRole(null);
        
        // Clear authentication-related data
        localStorage.removeItem('role');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('doctor_token');
        
        // Clear doctor profile cache when logging out
        try {
            const { doctorProfileService, DoctorProfileService } = require('./api/services/doctorProfileService');
            if (DoctorProfileService?.resetInstance) {
                DoctorProfileService.resetInstance();
            }
            if (doctorProfileService) {
                doctorProfileService.clearCache();
            }
        } catch (error) {
            console.log('Doctor profile service not available during logout');
        }
    };

    const handleSignUp = (userRole?: string) => {
        const savedRole = localStorage.getItem('role');
        const finalRole = (userRole || savedRole || 'customer').toLowerCase();
        setIsAuthenticated(true);
        setRole(finalRole);
        localStorage.setItem('role', finalRole);
    };
    return (
        <Router>
            <NotificationProvider>
                <AppRouter
                    isAuthenticated={isAuthenticated}
                    onAuthToggle={handleAuthToggle}
                    handleLogin={handleLogin}
                    handleSignUp={handleSignUp}
                    role={role}
                />
            </NotificationProvider>
        </Router>
    );
}

export default App;
