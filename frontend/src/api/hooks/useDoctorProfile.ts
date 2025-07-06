import { useEffect, useState } from 'react';
import { DoctorProfile } from '../services/doctorService';
import { doctorProfileService } from '../services/doctorProfileService';

export const useDoctorProfile = () => {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = doctorProfileService.subscribe((newProfile, isLoading) => {
            setProfile(newProfile);
            setLoading(isLoading);
        });

        doctorProfileService.loadProfile();

        return unsubscribe;
    }, []);

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
