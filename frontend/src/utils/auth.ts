export interface UserProfile {
    id: number;
    email: string;
    role: string;
    profile: {
        id: number;
        name: string;
        phoneNumber?: string;
        dateOfBirth?: string;
        address?: string;
        gender?: boolean;
        cccd?: string;
    } | null;
}

export const getCurrentUserProfile = (): UserProfile | null => {
    try {
        const userProfile = localStorage.getItem('userProfile');
        return userProfile ? JSON.parse(userProfile) : null;
    } catch (error) {
        console.error('Error parsing user profile:', error);
        return null;
    }
};

export const getCurrentStaffId = (): number | null => {
    const profile = getCurrentUserProfile();
    return profile?.profile?.id || null;
};

export const getCurrentUserName = (): string | null => {
    const profile = getCurrentUserProfile();
    return profile?.profile?.name || null;
};

/**
 * Clears all authentication data and caches
 */
export const clearAuthenticationData = async () => {
    try {
        // Clear localStorage
        localStorage.removeItem('userProfile');
        localStorage.removeItem('doctor_token');
        localStorage.removeItem('role');
        
        // Clear doctor profile cache
        const { doctorProfileService, DoctorProfileService } = await import('../api/services/doctorProfileService');
        
        if (DoctorProfileService?.resetInstance) {
            DoctorProfileService.resetInstance();
        }
        
        if (doctorProfileService) {
            doctorProfileService.clearCache();
        }
        
        console.log('Authentication data cleared successfully');
    } catch (error) {
        console.error('Error clearing authentication data:', error);
    }
};

/**
 * Prepares for new user login by clearing previous user's data
 */
export const prepareForNewUser = async (newRole?: string) => {
    console.log('Preparing for new user login with role:', newRole);
    
    await clearAuthenticationData();
    
    // Force reset doctor profile service instance for any new user
    try {
        const { DoctorProfileService } = await import('../api/services/doctorProfileService');
        if (DoctorProfileService?.resetInstance) {
            DoctorProfileService.resetInstance();
            console.log('Doctor profile service instance reset');
        }
    } catch (error) {
        console.log('Doctor profile service reset not available');
    }
};
