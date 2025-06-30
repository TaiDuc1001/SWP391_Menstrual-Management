import { useState, useEffect } from 'react';
import { doctorService, DoctorProfile } from '../services/doctorService';

export const useDoctorProfile = () => {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get accountId from localStorage
            const userProfile = localStorage.getItem('userProfile');
            const accountId = userProfile ? JSON.parse(userProfile).id : undefined;
            
            if (!accountId) {
                setError('User profile not found. Please log in again.');
                setLoading(false);
                return;
            }
            
            const response = await doctorService.getDoctorProfile(accountId);
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
            
            // Ensure we have an id for the update
            if (!profileData.id && profile) {
                profileData.id = profile.id;
            }
            
            // If still no id, try to get from current profile
            if (!profileData.id) {
                const userProfile = localStorage.getItem('userProfile');
                const accountId = userProfile ? JSON.parse(userProfile).id : undefined;
                
                if (accountId) {
                    try {
                        const currentProfile = await doctorService.getDoctorProfile(accountId);
                        profileData.id = currentProfile.data.id;
                    } catch (err) {
                        console.error('Failed to get current profile for ID:', err);
                    }
                }
            }
            
            if (!profileData.id) {
                throw new Error('Missing doctor id for profile update');
            }
            
            const response = await doctorService.updateDoctorProfile(profileData);
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
