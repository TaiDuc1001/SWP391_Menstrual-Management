import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { getCurrentUserProfile } from '../../utils/auth';
import { Button } from '../../components';

interface CustomerProfile {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: boolean;
    cccd: string;
    address: string;
}

interface ExtendedUserProfile {
    id: number;
    email: string;
    role: string;
    profile: {
        id: number;
        name: string;
        phoneNumber?: string;
        dateOfBirth?: string;
        gender?: boolean;
        cccd?: string;
        address?: string;
    } | null;
}

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [editedProfile, setEditedProfile] = useState<CustomerProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const userProfile = getCurrentUserProfile() as ExtendedUserProfile | null;
            if (!userProfile?.profile?.id) {
                setError('Please log in to view your profile');
                navigate('/login');
                return;
            }

            const customerData = userProfile.profile;
            
            const profileData: CustomerProfile = {
                id: customerData.id,
                name: customerData.name || '',
                email: userProfile.email || '',
                phoneNumber: customerData.phoneNumber || '',
                dateOfBirth: customerData.dateOfBirth || '',
                gender: customerData.gender ?? false,
                cccd: customerData.cccd || '',
                address: customerData.address || ''
            };
            
            setProfile(profileData);
            setEditedProfile(profileData);
            
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof CustomerProfile, value: string | boolean) => {
        if (editedProfile) {
            setEditedProfile({
                ...editedProfile,
                [field]: value
            });
        }
    };

    const handleSave = async () => {
        if (!editedProfile) return;

        if (!editedProfile.name.trim()) {
            setError('Name is required');
            return;
        }

        if (!editedProfile.phoneNumber.trim()) {
            setError('Phone number is required');
            return;
        }

        if (!editedProfile.dateOfBirth) {
            setError('Date of birth is required');
            return;
        }

        if (!editedProfile.address.trim()) {
            setError('Address is required');
            return;
        }

        setSaving(true);
        setError(null);
        
        try {
            const updateData = {
                id: editedProfile.id,
                name: editedProfile.name.trim(),
                phoneNumber: editedProfile.phoneNumber.trim(),
                dateOfBirth: editedProfile.dateOfBirth,
                gender: editedProfile.gender,
                cccd: editedProfile.cccd.trim(),
                address: editedProfile.address.trim()
            };

            const response = await api.put(`/customers/${editedProfile.id}`, updateData);

            const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            if (storedProfile.profile) {
                Object.assign(storedProfile.profile, updateData);
                localStorage.setItem('userProfile', JSON.stringify(storedProfile));

                window.dispatchEvent(new CustomEvent('profileUpdated'));
            }

            setProfile(editedProfile);
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            
        } catch (err: any) {
            console.error('Error updating profile:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
        setError(null);
    };

    const generateAvatarUrl = (name: string) => {
        const encodedName = encodeURIComponent(name || 'User');
        return `https://ui-avatars.com/api/?name=${encodedName}&size=128&background=ec4899&color=ffffff&bold=true`;
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const isProfileIncomplete = (profile: CustomerProfile | null) => {
        if (!profile) return true;
        return !profile.name || !profile.phoneNumber || !profile.dateOfBirth || !profile.address;
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-red-500">Failed to load profile</div>
            </div>
        );
    }

    const showIncompleteWarning = isProfileIncomplete(profile);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your personal information and account settings</p>
                    </div>
                    {!isEditing && (
                        <Button
                            variant="primary"
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-3"
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>

                {}
                {showIncompleteWarning && !isEditing && (
                    <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                        <div className="flex items-center">
                            <div className="text-yellow-600 mr-3">⚠️</div>
                            <div>
                                <h3 className="text-yellow-800 font-medium">Complete Your Profile</h3>
                                <p className="text-yellow-700 text-sm mt-1">
                                    Please fill out all required information to get the best experience.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                        <div className="text-green-700">{successMessage}</div>
                    </div>
                )}

                {}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                        <div className="text-red-700">{error}</div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <img
                                        src={generateAvatarUrl(editedProfile?.name || profile.name)}
                                        alt="Profile Avatar"
                                        className="w-32 h-32 rounded-full border-4 border-pink-200 shadow-lg"
                                    />
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        showIncompleteWarning 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {showIncompleteWarning ? 'Profile Incomplete' : 'Profile Complete'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            value={editedProfile?.name || ''}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {profile.name || 'Not provided'}
                                        </p>
                                    )}
                                </div>

                                {}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <p className="p-3 bg-gray-100 rounded-lg text-gray-600">
                                        {profile.email}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                {}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            value={editedProfile?.phoneNumber || ''}
                                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                            placeholder="Enter your phone number"
                                        />
                                    ) : (
                                        <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {profile.phoneNumber || 'Not provided'}
                                        </p>
                                    )}
                                </div>

                                {}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth <span className="text-red-500">*</span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            value={editedProfile?.dateOfBirth || ''}
                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                        />
                                    ) : (                                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                        {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not provided'}
                                    </p>
                                    )}
                                </div>

                                {}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            value={editedProfile?.gender ? 'true' : 'false'}
                                            onChange={(e) => handleInputChange('gender', e.target.value === 'true')}
                                        >
                                            <option value="false">Female</option>
                                            <option value="true">Male</option>
                                        </select>
                                    ) : (
                                        <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {profile.gender ? 'Male' : 'Female'}
                                        </p>
                                    )}
                                </div>

                                {}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Citizen ID (CCCD)
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            value={editedProfile?.cccd || ''}
                                            onChange={(e) => handleInputChange('cccd', e.target.value)}
                                            placeholder="Enter your citizen ID"
                                        />
                                    ) : (
                                        <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {profile.cccd || 'Not provided'}
                                        </p>
                                    )}
                                </div>

                                {}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            rows={3}
                                            value={editedProfile?.address || ''}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Enter your full address"
                                        />
                                    ) : (
                                        <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                                            {profile.address || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {}
                            {isEditing && (
                                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-8 py-3"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="px-8 py-3"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

