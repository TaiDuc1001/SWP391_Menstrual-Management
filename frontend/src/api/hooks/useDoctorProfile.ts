import { useState, useEffect } from 'react';
import { doctorService, DoctorProfile } from '../services/doctorService';
import { getCurrentUserProfile } from '../../utils/auth';

export const useDoctorProfile = () => {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = getCurrentUserProfile();
            const doctorId = user?.profile?.id;
            if (!doctorId) throw new Error('No doctor id');
            const response = await doctorService.getDoctorProfile(doctorId);
            setProfile(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load profile');
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData: Partial<DoctorProfile>) => {
        try {
            setError(null);
            const user = getCurrentUserProfile();
            const doctorId = user?.profile?.id;
            if (!doctorId) throw new Error('No doctor id');
            const response = await doctorService.updateDoctorProfile(doctorId, profileData);
            setProfile(response.data);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
            throw err;
        }
    };

    const uploadAvatar = async (file: File) => {
        try {
            setError(null);
            const response = await doctorService.uploadAvatar(file);
            return response.data.url;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload avatar');
            throw err;
        }
    };

    const checkProfileComplete = async () => {
        try {
            const response = await doctorService.checkProfileComplete();
            return response.data.isComplete;
        } catch (err: any) {
            console.error('Error checking profile status:', err);
            return false;
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        loadProfile,
        updateProfile,
        uploadAvatar,
        checkProfileComplete
    };
};

export default useDoctorProfile;
