import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { doctorService, DoctorProfile } from '../../api/services/doctorService';

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const response = await doctorService.getDoctorProfile();
                setProfile(response.data);
            } catch (error) {
                console.error('Error loading profile:', error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header with Background Pattern */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                <div className="relative px-6 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white/20">
                                        <div className="text-4xl">👨‍⚕️</div>
                                    </div>
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg ${
                                        profile.isProfileComplete ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}>
                                        {completionPercentage}%
                                    </div>
                                </div>
                                
                                {/* Doctor Info */}
                                <div className="text-white">
                                    <h1 className="text-3xl font-bold mb-2">{profile.name || 'Doctor Name'}</h1>
                                    <p className="text-blue-100 text-lg mb-1">{profile.specialization || 'Medical Specialist'}</p>
                                    <div className="flex items-center space-x-4 text-sm text-blue-200">
                                        <div className="flex items-center space-x-1">
                                            <span>💰</span>
                                            <span>${profile.price > 0 ? profile.price : 'Not set'} USD</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span>🏥</span>
                                            <span>{profile.specialization || 'Medical Specialist'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="space-y-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate('/doctor/manage-profile')}
                                    className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg"
                                >
                                    <span className="mr-2">✏️</span>
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="max-w-4xl mx-auto px-6 pt-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>{successMessage}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Completion Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-800">Profile Completion</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    completionPercentage === 100 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {completionPercentage}%
                                </span>
                            </div>
                            
                            {/* Progress Ring */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative w-24 h-24">
                                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke={completionPercentage === 100 ? "#10b981" : "#f59e0b"}
                                            strokeWidth="2"
                                            strokeDasharray={`${completionPercentage}, 100`}
                                            className="transition-all duration-300"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-gray-700">{completionPercentage}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            {completionPercentage < 100 && (
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-3">Complete your profile to unlock all features</p>
                                    <Button
                                        variant="primary"
                                        size="small"
                                        onClick={() => navigate('/doctor/manage-profile')}
                                        className="w-full"
                                    >
                                        Complete Profile
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                                    <p className="text-lg font-medium text-gray-800 bg-gray-50 rounded-lg px-4 py-3">
                                        {profile.name || 'Not provided'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Specialization</label>
                                    <p className="text-lg font-medium text-gray-800 bg-gray-50 rounded-lg px-4 py-3">
                                        {profile.specialization || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Consultation Fee</h3>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    USD Currency
                                </span>
                            </div>
                            
                            <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                                <div className="text-5xl font-bold text-green-600 mb-2">
                                    ${profile.price > 0 ? profile.price : '0'}
                                </div>
                                <p className="text-gray-600">per consultation</p>
                                {profile.price === 0 && (
                                    <p className="text-sm text-orange-600 mt-2">⚠️ Please set your consultation fee</p>
                                )}
                            </div>
                        </div>

                        {/* Profile Status */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Status</h3>
                            
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full ${
                                        profile.isProfileComplete ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {profile.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {profile.isProfileComplete 
                                                ? 'Your profile is ready for patients' 
                                                : 'Complete your profile to start accepting patients'
                                            }
                                        </p>
                                    </div>
                                </div>
                                
                                {!profile.isProfileComplete && (
                                    <Button
                                        variant="primary"
                                        size="small"
                                        onClick={() => navigate('/doctor/manage-profile')}
                                    >
                                        Complete Now
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to help more patients?</h2>
                        <p className="text-blue-100 mb-6">
                            Keep your profile updated to attract more patients and provide better care.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/doctor/manage-profile')}
                                className="bg-white text-blue-600 hover:bg-blue-50"
                            >
                                Update Profile
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/doctor/dashboard')}
                                className="text-white border-white hover:bg-white/10"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
