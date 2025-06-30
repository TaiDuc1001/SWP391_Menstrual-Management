import React, {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import AppRouter from './AppRouter';

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
        
        // NOTE: We intentionally DO NOT clear profile data (mock_doctor_profile_*) 
        // to preserve user's profile information between login sessions
        // This is the expected behavior - profile data should persist
        
        // Also clear the old shared keys if they exist (for backward compatibility)
        localStorage.removeItem('mock_doctor_profile');
        localStorage.removeItem('menstrual_symptoms');
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
            <AppRouter
                isAuthenticated={isAuthenticated}
                onAuthToggle={handleAuthToggle}
                handleLogin={handleLogin}
                handleSignUp={handleSignUp}
                role={role}
            />
        </Router>
    );
}

export default App;
