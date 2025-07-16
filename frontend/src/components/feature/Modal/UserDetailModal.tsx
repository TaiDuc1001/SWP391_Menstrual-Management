import React, { useState, useEffect } from 'react';
import { AccountForUI } from '../../../api/services/accountService';
import { DoctorProfile } from '../../../api/services/doctorService';
import { doctorService } from '../../../api/services/doctorService';
import { doctorRatingService } from '../../../api/services/doctorRatingService';
import { generateAvatarUrl } from '../../../utils/avatar';

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: AccountForUI | null;
    onEditUser?: (user: AccountForUI) => void;
    onEditDoctorProfile?: (user: AccountForUI, profile: DoctorProfile) => void;
}

interface DoctorProfileWithRating extends DoctorProfile {
    averageRating?: number;
    totalRatings?: number;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
    isOpen,
    onClose,
    user,
    onEditUser,
    onEditDoctorProfile
}) => {
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfileWithRating | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    useEffect(() => {
        if (isOpen && user && user.role === 'DOCTOR') {
            const fetchProfile = async () => {
                setProfileLoading(true);
                setProfileError(null);
                try {
                    const profileResponse = await doctorService.getDoctorById(user.id);
                    let profile = profileResponse.data;
                    const doctorProfileRaw: DoctorProfileWithRating = {
                        id: profile.id ?? 0,
                        name: profile.name ?? '',
                        specialization: profile.specialization ?? '',
                        price: profile.price ?? 0,
                        experience: profile.experience ?? 0,
                        isProfileComplete: !!(profile.name && profile.specialization && profile.price > 0),
                        degree: profile.degree ?? '',
                        university: profile.university ?? '',
                        averageRating: 0,
                        totalRatings: 0
                    };
                    try {
                        const ratingResponse = await doctorRatingService.getDoctorAverageRating(user.id);
                        const { averageRating, totalRatings } = ratingResponse.data;
                        setDoctorProfile({
                            ...doctorProfileRaw,
                            averageRating: averageRating || 0,
                            totalRatings: totalRatings || 0
                        });
                    } catch (ratingError) {
                        setDoctorProfile({
                            ...doctorProfileRaw,
                            averageRating: 0,
                            totalRatings: 0
                        });
                    }
                } catch (error) {
                    setProfileError('Failed to load doctor profile information');
                    setDoctorProfile(null);
                } finally {
                    setProfileLoading(false);
                }
            };
            fetchProfile();
        } else {
            setDoctorProfile(null);
        }
    }, [isOpen, user]);

    const handleEditProfile = () => {
        if (user && doctorProfile && onEditDoctorProfile) {
            onEditDoctorProfile(user, doctorProfile);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'CUSTOMER':
                return 'bg-green-100 text-green-600';
            case 'DOCTOR':
                return 'bg-yellow-100 text-yellow-600';
            case 'STAFF':
                return 'bg-blue-100 text-blue-600';
            case 'ADMIN':
                return 'bg-purple-100 text-purple-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active':
                return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">Active</span>;
            case 'Locked':
                return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Locked</span>;
            default:
                return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">{status}</span>;
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={user.avatar} 
                                alt="avatar" 
                                className="w-14 h-14 rounded-full border-2 border-gray-200"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = generateAvatarUrl(user.name);
                                }}
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        user.status === 'Active' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {onEditUser && (
                                <button
                                    onClick={() => onEditUser(user)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    Edit Account
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Side - Account Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                        {user.name}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                        {user.email}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                        {user.phone || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Doctor Profile Section */}
                        {user.role === 'DOCTOR' ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Doctor Profile</h3>
                                    {doctorProfile && onEditDoctorProfile && (
                                        <button
                                            onClick={handleEditProfile}
                                            className="px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                {profileLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
                                        <span className="ml-3 text-gray-600 text-sm">Loading...</span>
                                    </div>
                                ) : profileError ? (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <div className="text-red-700 text-sm">
                                            {profileError}
                                        </div>
                                    </div>
                                ) : doctorProfile ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-gray-900">
                                                {doctorProfile.specialization || 'Not specified'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-gray-900">
                                                {doctorProfile.experience !== undefined ? doctorProfile.experience + ' years' : 'Not set'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-gray-900">
                                                {doctorProfile.degree || <span className="text-gray-500">Not set</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-gray-900">
                                                {doctorProfile.university || <span className="text-gray-500">Not set</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-gray-900">
                                                {doctorProfile.price > 0 
                                                    ? (
                                                        <span className="font-semibold text-green-600">
                                                            {doctorProfile.price.toLocaleString('vi-VN')} VND
                                                        </span>
                                                    )
                                                    : <span className="text-gray-500">Not set</span>
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Average Rating</label>
                                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <svg 
                                                                key={star}
                                                                className={`w-4 h-4 ${
                                                                    doctorProfile.averageRating && star <= Math.round(doctorProfile.averageRating)
                                                                        ? 'text-yellow-400' 
                                                                        : 'text-gray-300'
                                                                }`}
                                                                fill="currentColor" 
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-700">
                                                        {doctorProfile.averageRating !== undefined && doctorProfile.averageRating > 0 
                                                            ? `${doctorProfile.averageRating.toFixed(1)} / 5.0` 
                                                            : 'No ratings yet'
                                                        }
                                                    </span>
                                                    {doctorProfile.totalRatings !== undefined && doctorProfile.totalRatings > 0 && (
                                                        <span className="text-gray-500 text-xs">({doctorProfile.totalRatings} reviews)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Status</label>
                                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                                                {doctorProfile.isProfileComplete ? (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                                                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </span>
                                                        <span className="text-green-700 font-medium text-sm">Complete</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full">
                                                            <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </span>
                                                        <span className="text-orange-700 font-medium text-sm">Incomplete</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                                        <div className="text-gray-600 text-sm">
                                            No doctor profile found for this user.
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-gray-700 font-medium">Standard User Account</h4>
                                    <p className="text-gray-500 text-sm mt-1">This user has a standard account.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
