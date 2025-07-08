import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { DoctorProfile } from '../../api/services/doctorService';
import { useDoctorProfile } from '../../api/hooks/useDoctorProfile';

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const { profile, loading } = useDoctorProfile();

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
        <div className="min-h-screen bg-gray-50">
            {/* Compact Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-600 mt-1">View your professional information</p>
                        </div>
                        <button
                            onClick={() => navigate('/doctor/dashboard')}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-3xl text-white">👨‍⚕️</span>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {profile.name || 'Doctor Name'}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {profile.specialization || 'Medical Specialist'}
                                </p>
                            </div>

                            {/* Status Badge */}
                            <div className="text-center mb-6">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    profile.isProfileComplete 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-orange-100 text-orange-800'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                        profile.isProfileComplete ? 'bg-green-400' : 'bg-orange-400'
                                    }`}></span>
                                    {profile.isProfileComplete ? 'Active' : 'Incomplete'}
                                </span>
                            </div>

                            {/* Profile Completion */}
                            <div className="text-center">
                                <div className="relative w-16 h-16 mx-auto mb-3">
                                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                            strokeDasharray={`${completionPercentage}, 100`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-semibold text-gray-900">{completionPercentage}%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600">Profile Complete</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-md">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-900 font-medium">
                                                {profile.name || 'Not provided'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-md">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                            <span className="text-gray-900 font-medium">
                                                {profile.specialization || 'Not provided'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Consultation Fee */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Consultation Fee</h3>
                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">VND</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {profile.price > 0 ? profile.price.toLocaleString('vi-VN') : '0'} VND
                                    </div>
                                    <p className="text-gray-600">per consultation</p>
                                    {profile.price === 0 && (
                                        <div className="mt-3 p-3 bg-orange-50 rounded-md">
                                            <p className="text-sm text-orange-700">
                                                ⚠️ Consultation fee not set
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Status Details */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Profile Status</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 bg-gray-50 rounded-md">
                                        <div className="text-2xl mb-2">📝</div>
                                        <div className="text-xs text-gray-600 mb-1">Name</div>
                                        <div className={`text-sm font-medium ${profile.name ? 'text-green-600' : 'text-red-600'}`}>
                                            {profile.name ? '✓' : '✗'}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-md">
                                        <div className="text-2xl mb-2">🏥</div>
                                        <div className="text-xs text-gray-600 mb-1">Specialization</div>
                                        <div className={`text-sm font-medium ${profile.specialization ? 'text-green-600' : 'text-red-600'}`}>
                                            {profile.specialization ? '✓' : '✗'}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-md">
                                        <div className="text-2xl mb-2">�</div>
                                        <div className="text-xs text-gray-600 mb-1">Price</div>
                                        <div className={`text-sm font-medium ${profile.price > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {profile.price > 0 ? '✓' : '✗'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-4 bg-gray-50 rounded-md">
                                    <div className={`w-3 h-3 rounded-full mr-3 ${
                                        profile.isProfileComplete ? 'bg-green-500' : 'bg-orange-500'
                                    }`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {profile.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {profile.isProfileComplete 
                                                ? 'Ready to accept patients' 
                                                : 'Complete missing fields to activate'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button
                                        onClick={() => navigate('/doctor/appointments')}
                                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Appointments
                                    </button>
                                    <button
                                        onClick={() => navigate('/doctor/reschedule')}
                                        className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Reschedules
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
