import { useEffect, useState } from 'react';
import { DoctorProfile } from '../services/doctorService';
import { doctorProfileService } from '../services/doctorProfileService';
import { getCurrentUserProfile } from '../../utils/auth';

export const useDoctorProfile = () => {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {

        const userProfile = getCurrentUserProfile();
        const userId = userProfile?.profile?.id;
        
        if (userId && userId !== currentUserId) {

            setCurrentUserId(userId);
            doctorProfileService.clearCache();
            console.log('useDoctorProfile: User changed to:', userId, 'clearing cache');
        } else if (!userId) {

            setCurrentUserId(null);
            doctorProfileService.clearCache();
            console.log('useDoctorProfile: No user logged in, clearing cache');
        }

        const unsubscribe = doctorProfileService.subscribe((newProfile, isLoading) => {
            setProfile(newProfile);
            setLoading(isLoading);
        });

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

