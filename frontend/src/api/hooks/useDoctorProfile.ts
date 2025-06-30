import { useEffect, useState } from 'react';
import { DoctorProfile } from '../services/doctorService';
import { doctorProfileService } from '../services/doctorProfileService';

export const useDoctorProfile = (useMockAPI: boolean = false) => {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = doctorProfileService.subscribe((newProfile, isLoading) => {
            setProfile(newProfile);
            setLoading(isLoading);
        });

        doctorProfileService.loadProfile(useMockAPI);

        return unsubscribe;
    }, [useMockAPI]);

    const updateProfile = async (profileData: Partial<DoctorProfile>) => {
        return await doctorProfileService.updateProfile(profileData, useMockAPI);
    };

    const checkProfileComplete = async () => {
        return await doctorProfileService.checkProfileComplete(useMockAPI);
    };

    return {
        profile,
        loading,
        updateProfile,
        checkProfileComplete
    };
};
