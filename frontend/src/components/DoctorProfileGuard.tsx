import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { doctorService } from '../api/services/doctorService';
import { mockDoctorService } from '../api/services/mockDoctorService';
import { API_CONFIG } from '../config/api';

interface DoctorProfileGuardProps {
    children: React.ReactNode;
}

const DoctorProfileGuard: React.FC<DoctorProfileGuardProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const location = useLocation();

    // Allow access to profile management routes without checking
    const allowedRoutes = [
        '/doctor/manage-profile',
        '/doctor/setup-profile'
    ];

    const isAllowedRoute = allowedRoutes.some(route => 
        location.pathname.startsWith(route)
    );

    useEffect(() => {
        const checkProfileStatus = async () => {
            try {
                const service = API_CONFIG.USE_MOCK_API ? mockDoctorService : doctorService;
                
                // Get accountId from localStorage
                const userProfile = localStorage.getItem('userProfile');
                const accountId = userProfile ? JSON.parse(userProfile).id : undefined;
                
                if (!accountId) {
                    console.error('User profile not found in localStorage');
                    setIsProfileComplete(false);
                    setIsLoading(false);
                    return;
                }
                
                // First try to fetch the doctor profile
                try {
                    await service.getDoctorProfile(accountId);
                    // If we get here without error, profile exists
                    setIsProfileComplete(true);
                } catch (error: any) {
                    // If 404, profile doesn't exist
                    if (error.response && error.response.status === 404) {
                        setIsProfileComplete(false);
                    } else {
                        // For other errors, check the completion status
                        try {
                            const response = await service.checkProfileComplete();
                            // Handle both formats (boolean or object with isComplete)
                            if (typeof response.data === 'boolean') {
                                setIsProfileComplete(response.data);
                            } else if (response.data && typeof response.data.isComplete === 'boolean') {
                                setIsProfileComplete(response.data.isComplete);
                            } else {
                                // Default to false if response format is unexpected
                                setIsProfileComplete(false);
                            }
                        } catch (checkError) {
                            console.error('Error checking profile completion:', checkError);
                            setIsProfileComplete(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking profile status:', error);
                // If API fails, assume profile is incomplete to be safe
                setIsProfileComplete(false);
            } finally {
                setIsLoading(false);
            }
        };

        // Only check if not on allowed routes
        if (!isAllowedRoute) {
            checkProfileStatus();
        } else {
            setIsLoading(false);
            setIsProfileComplete(true); // Allow access to profile routes
        }
    }, [isAllowedRoute]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang kiểm tra thông tin...</p>
                </div>
            </div>
        );
    }

    // If profile is not complete and not on allowed routes, redirect to setup
    if (!isProfileComplete && !isAllowedRoute) {
        return <Navigate to="/doctor/setup-profile" replace />;
    }

    return <>{children}</>;
};

export default DoctorProfileGuard;
