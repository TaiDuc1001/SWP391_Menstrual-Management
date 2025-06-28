import React, { createContext, useContext, useEffect, useState } from 'react';
import { doctorService } from '../api/services/doctorService';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize auth from localStorage
        const hasToken = doctorService.initAuth();
        setIsAuthenticated(hasToken);
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        doctorService.setAuthToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        doctorService.removeAuthToken();
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
