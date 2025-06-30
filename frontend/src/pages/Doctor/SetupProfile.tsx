import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageProfile from './ManageProfile';
import { doctorService, DoctorProfile } from '../../api/services/doctorService';
import { mockDoctorService } from '../../api/services/mockDoctorService';
import { getCurrentUserProfile } from '../../utils/auth';

const USE_MOCK_API = false;

const SetupProfile: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkProfile = async () => {
            setLoading(true);
            const service = USE_MOCK_API ? mockDoctorService : doctorService;
            try {
                const user = getCurrentUserProfile();
                const doctorId = user?.profile?.id;
                if (!doctorId) throw new Error('No doctor id');
                const response = await service.getDoctorProfile(doctorId);
                const profile: DoctorProfile = response.data;
                const isEmpty = !profile.name?.trim() && !profile.specialization?.trim() && (!profile.price || profile.price <= 0);
                if (isEmpty) {
                    setIsFirstTime(true);
                } else {
                    navigate('/doctor/profile', { replace: true });
                }
            } catch {
                setIsFirstTime(true);
            } finally {
                setLoading(false);
            }
        };
        checkProfile();
    }, [navigate]);

    if (loading) return null;
    return <ManageProfile isFirstTime={isFirstTime} />;
};

export default SetupProfile;
