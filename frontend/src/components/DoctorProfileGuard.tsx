import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDoctorProfile } from '../api/hooks/useDoctorProfile';

interface DoctorProfileGuardProps {
    children: React.ReactNode;
}

const DoctorProfileGuard: React.FC<DoctorProfileGuardProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const location = useLocation();
    const { checkProfileComplete } = useDoctorProfile();

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
                console.log('DoctorProfileGuard: Checking profile completion status...');
                const result = await checkProfileComplete();
                setIsProfileComplete(result.isComplete);
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
    }, [isAllowedRoute, checkProfileComplete]);

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
