import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUserProfile } from '../utils/auth';

interface ProfileGuardProps {
    children: React.ReactNode;
}

const ProfileGuard: React.FC<ProfileGuardProps> = ({ children }) => {
    const userProfile = getCurrentUserProfile();
    
    // Check if user is logged in
    if (!userProfile) {
        return <Navigate to="/login" replace />;
    }
    
    // Only check profile completion for customers
    if (userProfile.role?.toLowerCase() === 'customer') {
        // Check if user has a complete profile with all required fields
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