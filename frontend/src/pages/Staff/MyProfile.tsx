import React, {useState, useEffect} from 'react';
import {StaffProfile} from '../../types';
import { staffService } from '../../api/services/staffService';
import { getCurrentStaffId } from '../../utils/auth';

const MyProfile: React.FC = () => {
    const [profile, setProfile] = useState<StaffProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const staffId = getCurrentStaffId();
        if (!staffId) {
            setError('Staff ID not found. Please login again.');
            setLoading(false);
            return;
        }
        setLoading(true);
        staffService.getStaffProfile(staffId)
            .then(res => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load profile');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64 text-lg font-semibold">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-64 text-red-500 font-semibold">{error}</div>;
    if (!profile) return null;

    const infoFields = [
        { label: 'Name', value: profile.name },
        { label: 'Email', value: profile.email },
        { label: 'Phone', value: profile.phone },
        { label: 'Position', value: profile.position },
        { label: 'Department', value: profile.department },
        { label: 'Join Date', value: profile.joinDate },
    ].filter(field => field.value && field.value.trim() !== '');

    return (
        <div className="flex flex-col items-center w-full py-8">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl border border-gray-200">
                <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">My Profile</h1>
                <div className="border rounded-lg p-6 bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
                    <div className="space-y-4">
                        {infoFields.length === 0 ? (
                            <div className="text-gray-400 italic">No information available.</div>
                        ) : (
                            infoFields.map(field => (
                                <div key={field.label} className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="w-40 font-medium text-gray-600">{field.label}</span>
                                    <span className="text-gray-900 ml-2 mt-1 sm:mt-0">{field.value}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

