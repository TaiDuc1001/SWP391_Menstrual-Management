import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDoctorProfile } from '../api/hooks/useDoctorProfile';
import { getCurrentUserProfile } from '../utils/auth';

interface DoctorProfileGuardProps {
    children: React.ReactNode;
}

const DoctorProfileGuard: React.FC<DoctorProfileGuardProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const location = useLocation();
    const { checkProfileComplete } = useDoctorProfile();

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

                const userProfile = getCurrentUserProfile();
                const userId = userProfile?.profile?.id;

                if (userId && userId !== currentUserId) {
                    setCurrentUserId(userId);
                    console.log('DoctorProfileGuard: User changed, checking profile for user:', userId);

                    const { doctorProfileService } = await import('../api/services/doctorProfileService');
                    doctorProfileService.clearCache();
                }
                
                console.log('DoctorProfileGuard: Checking profile completion status...');
                const result = await checkProfileComplete();
                setIsProfileComplete(result.isComplete);
            } catch (error) {
                console.error('Error checking profile status:', error);

                setIsProfileComplete(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (!isAllowedRoute) {
            checkProfileStatus();
        } else {
            setIsLoading(false);
            setIsProfileComplete(true); // Allow access to profile routes
        }
    }, [isAllowedRoute, checkProfileComplete, currentUserId]);

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

    if (!isProfileComplete && !isAllowedRoute) {
        return <Navigate to="/doctor/setup-profile" replace />;
    }

    return <>{children}</>;
};

export default DoctorProfileGuard;

