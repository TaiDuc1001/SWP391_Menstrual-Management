import { useEffect, useState } from 'react';
import { DoctorProfile } from '../services/doctorService';
import { doctorProfileService } from '../services/doctorProfileService';
import { getCurrentUserProfile } from '../../utils/auth';

export const useDoctorProfile = () => {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        // Check if user changed
        const userProfile = getCurrentUserProfile();
        const userId = userProfile?.profile?.id;
        
        if (userId && userId !== currentUserId) {
            // User changed, clear cache and reload
            setCurrentUserId(userId);
            doctorProfileService.clearCache();
            console.log('useDoctorProfile: User changed to:', userId, 'clearing cache');
        } else if (!userId) {
            // No user logged in, clear everything
            setCurrentUserId(null);
            doctorProfileService.clearCache();
            console.log('useDoctorProfile: No user logged in, clearing cache');
        }

        const unsubscribe = doctorProfileService.subscribe((newProfile, isLoading) => {
            setProfile(newProfile);
            setLoading(isLoading);
        });

        // Only load profile if user is logged in
        if (userId) {
            doctorProfileService.loadProfile();
        }

        return unsubscribe;
    }, [currentUserId]);

    const updateProfile = async (profileData: Partial<DoctorProfile>) => {
        return await doctorProfileService.updateProfile(profileData);
    };

    const checkProfileComplete = async () => {
        return await doctorProfileService.checkProfileComplete();
    };

    return {
        profile,
        loading,
        updateProfile,
        checkProfileComplete
    };
};
