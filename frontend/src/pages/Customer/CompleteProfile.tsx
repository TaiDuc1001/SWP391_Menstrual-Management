import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserProfile } from '../../utils/auth';
import api from '../../api/axios';

const CompleteProfile: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        gender: false,
        cccd: ''
    });

    const userProfile = getCurrentUserProfile();

    // Redirect if not logged in
    if (!userProfile) {
        navigate('/login');
        return null;
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Comprehensive validation
        const errors = [];
        if (!formData.name.trim()) errors.push('Full name is required');
        if (!formData.phoneNumber.trim()) errors.push('Phone number is required');
        if (!formData.dateOfBirth) errors.push('Date of birth is required');
        if (!formData.address.trim()) errors.push('Address is required');
        
        // Phone number validation
        const phoneRegex = /^[0-9]{10,11}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
            errors.push('Please enter a valid phone number');
        }
        
        // Date validation (must be at least 13 years old)
        if (formData.dateOfBirth) {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (age < 13 || (age === 13 && monthDiff < 0)) {
                errors.push('You must be at least 13 years old to use this service');
            }
        }
        
        if (errors.length > 0) {
            setError(errors.join('. '));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userProfile = getCurrentUserProfile();
            if (!userProfile) {
                setError('User session not found. Please try logging in again.');
                navigate('/login');
                return;
            }

            // For new registrations, the profile might be null, but we can still proceed
            const profileId = userProfile.profile?.id || userProfile.id;
            
            if (!profileId) {
                setError('User profile ID not found. Please contact support.');
                return;
            }

            await api.put(`/customers/${profileId}`, formData);
            
            // Update localStorage with new profile data
            const updatedProfile = {
                ...userProfile,
                profile: {
                    id: profileId,
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    dateOfBirth: formData.dateOfBirth,
                    address: formData.address,
                    gender: formData.gender,
                    cccd: formData.cccd
                }
            };
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            
            // Dispatch event to notify other components of profile update
            window.dispatchEvent(new CustomEvent('profileUpdated'));
            
            navigate('/customer/dashboard');
        } catch (err: any) {
            console.error('Error completing profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center mb-4">
                        <div className="bg-pink-100 rounded-full p-3">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" fill="#ec4899"/>
                                <rect x="6" y="14" width="12" height="6" rx="3" fill="#ec4899"/>
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Complete Your Profile
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please provide some basic information to get started with our services
                    </p>
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 text-center">
                            <strong>Important:</strong> All marked fields (*) are required to access your account
                        </p>
                    </div>
                </div>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number *
                            </label>
                            <input
                                id="phoneNumber"
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                    // Only allow numbers and limit length
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 11) {
                                        handleInputChange('phoneNumber', value);
                                    }
                                }}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="0123456789"
                            />
                            <p className="mt-1 text-xs text-gray-500">Enter your phone number (10-11 digits)</p>
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                                Date of Birth *
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                required
                                max={new Date().toISOString().split('T')[0]}
                                min={new Date(new Date().getFullYear() - 100, 0, 1).toISOString().split('T')[0]}
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">You must be at least 13 years old</p>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address *
                            </label>
                            <textarea
                                id="address"
                                required
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                rows={3}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your address"
                            />
                        </div>

                        <div>
                            <label htmlFor="cccd" className="block text-sm font-medium text-gray-700">
                                CCCD/ID Number
                            </label>
                            <input
                                id="cccd"
                                type="text"
                                value={formData.cccd}
                                onChange={(e) => handleInputChange('cccd', e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your CCCD/ID number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <div className="mt-2 space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={!formData.gender}
                                        onChange={() => handleInputChange('gender', false)}
                                        className="form-radio text-pink-600"
                                    />
                                    <span className="ml-2">Female</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={formData.gender}
                                        onChange={() => handleInputChange('gender', true)}
                                        className="form-radio text-pink-600"
                                    />
                                    <span className="ml-2">Male</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Profile...
                                </div>
                            ) : (
                                'Complete Profile & Continue'
                            )}
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                            By completing your profile, you agree that the information provided is accurate and will be used to personalize your experience.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;