
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { DoctorProfile } from '../../api/services/doctorService';
import { useDoctorProfile } from '../../api/hooks/useDoctorProfile';
import { doctorRatingService } from '../../api/services/doctorRatingService';

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const { profile, loading } = useDoctorProfile();
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [totalRatings, setTotalRatings] = useState<number | null>(null);

    useEffect(() => {
        if (typeof profile?.id === 'number') {
            doctorRatingService.getDoctorAverageRating(profile.id)
                .then(res => {
                    setAverageRating(res.data.averageRating);
                    setTotalRatings(res.data.totalRatings);
                })
                .catch(() => {
                    setAverageRating(null);
                    setTotalRatings(null);
                });
        }
    }, [profile]);

    const calculateCompletionPercentage = (profile: DoctorProfile): number => {
        let completed = 0;
        let total = 3;
        
        if (profile.name && profile.name.trim() !== '') completed++;
        if (profile.specialization && profile.specialization.trim() !== '') completed++;
        if (profile.price > 0) completed++;
        
        return Math.round((completed / total) * 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🩺</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't load your profile. Please try again.</p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    const completionPercentage = calculateCompletionPercentage(profile);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-2xl shadow p-8 border border-gray-200 mb-8">
                    {/* Avatar & Completion */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="relative mb-3">
                            <div className="w-28 h-28 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-5xl text-gray-400">
                                <span role="img" aria-label="Doctor">👨‍⚕️</span>
                            </div>
                            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow ${completionPercentage === 100 ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <span className="text-white text-base font-bold">
                                    {completionPercentage === 100 ? '✓' : completionPercentage + '%'}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Profile Completion</div>
                    </div>
                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="mb-1">
                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 font-medium">Medical Professional</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dr. {profile.name || 'Your Name'}</h1>
                        <div className="text-base text-gray-500 mb-1 flex items-center justify-center md:justify-start gap-2">
                            <span>🩺</span>
                            <span>{profile.specialization || 'Specialization not set'}</span>
                        </div>
                        <div className="text-base text-gray-500 flex items-center justify-center md:justify-start gap-2">
                            <span>💼</span>
                            <span>Consultation Fee:</span>
                            <span className="font-semibold text-gray-700">
                                {profile.price > 0 ? `${profile.price.toLocaleString('vi-VN')} VND` : 'Not set'}
                            </span>
                        </div>
                        {/* Doctor Rating */}
                        <div className="text-base text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-2">
                            <span>⭐</span>
                            <span>Avg. Rating:</span>
                            <span className="font-semibold text-yellow-600">
                                {averageRating !== null ? averageRating.toFixed(1) : 'N/A'}
                            </span>
                            <span>({totalRatings !== null ? totalRatings : 0} ratings)</span>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Professional Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Full Name</div>
                                    <div className="p-3 bg-gray-50 rounded border border-gray-100 text-gray-800 font-medium">
                                        {profile.name || 'Not provided'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Specialization</div>
                                    <div className="p-3 bg-gray-50 rounded border border-gray-100 text-gray-800 font-medium">
                                        {profile.specialization || 'Not provided'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Profile Status */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-8 h-8 rounded flex items-center justify-center ${profile.isProfileComplete ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <span className="text-white text-lg">
                                        {profile.isProfileComplete ? '✓' : '!'}
                                    </span>
                                </div>
                                <h2 className="text-base font-semibold text-gray-700">Profile Status</h2>
                            </div>
                            <div className="p-4 rounded border border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-base font-bold ${profile.isProfileComplete ? 'text-green-700' : 'text-gray-700'}`}>{profile.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {profile.isProfileComplete ? 'Your profile is ready and visible to patients.' : 'Complete your profile to start accepting patients.'}
                                        </div>
                                    </div>
                                    {!profile.isProfileComplete && (
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate('/doctor/manage-profile')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                        >
                                            Complete Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Consultation Fee */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 text-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-xl text-gray-400">
                                <span>💰</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-1">Consultation Fee</div>
                            <div className="text-2xl font-bold text-gray-800 mb-1">
                                {profile.price > 0 ? profile.price.toLocaleString('vi-VN') : '0'}
                                <span className="text-base ml-1">VND</span>
                            </div>
                            <div className="text-xs text-gray-400">per consultation session</div>
                            {profile.price === 0 && (
                                <div className="mt-3 p-2 bg-gray-100 rounded border border-gray-200 text-xs text-gray-500">
                                    Please set your consultation fee
                                </div>
                            )}
                        </div>
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">Profile Completion</span>
                                <span className="text-xs font-semibold text-gray-700">{completionPercentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                                <div 
                                    className={`h-full ${completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-400'} transition-all duration-500`}
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${profile.isProfileComplete ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                    {profile.isProfileComplete ? 'Active' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
