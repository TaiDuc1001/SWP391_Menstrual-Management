import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUserProfile } from '../utils/auth';

interface ProfileGuardProps {
    children: React.ReactNode;
}

const ProfileGuard: React.FC<ProfileGuardProps> = ({ children }) => {
    const userProfile = getCurrentUserProfile();

    if (!userProfile) {
        return <Navigate to="/login" replace />;
    }

    if (userProfile.role?.toLowerCase() === 'customer') {

        const hasCompleteProfile = userProfile.profile && 
            userProfile.profile.name &&
            userProfile.profile.phoneNumber &&
            userProfile.profile.dateOfBirth &&
            userProfile.profile.address;
            
        if (!hasCompleteProfile) {
            return <Navigate to="/customer/complete-profile" replace />;
        }
    }
    
    return <>{children}</>;
};

export default ProfileGuard;
