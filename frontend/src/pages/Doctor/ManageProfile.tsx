import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { doctorService, DoctorProfile } from '../../api/services/doctorService';
import { SimpleNotification, useSimpleNotification } from '../../components/common/SimpleNotification';

interface ManageProfileProps {
    isFirstTime?: boolean;
}

// Validation schema
const validateProfile = (profile: Partial<DoctorProfile>) => {
    const errors: Record<string, string> = {};
    if (!profile.name?.trim()) {
        errors.name = 'Name is required';
    }
    if (!profile.specialization?.trim()) {
        errors.specialization = 'Specialization is required';
    }
    if (!profile.price || profile.price <= 0) {
        errors.price = 'Price must be greater than 0';
    }
    return errors;
};

const calculateCompletion = (profile: Partial<DoctorProfile>): number => {
    const completedFields = [
        profile.name?.trim(),
        profile.specialization?.trim(),
        profile.price && profile.price > 0
    ].filter(Boolean).length;
    return Math.round((completedFields / 3) * 100);
};

const ManageProfile: React.FC<ManageProfileProps> = ({ isFirstTime = false }) => {
    const navigate = useNavigate();
    const { notification, showNotification, hideNotification } = useSimpleNotification();
    const [profile, setProfile] = useState<Partial<DoctorProfile>>({
        name: '',
        specialization: '',
        price: undefined
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load profile and specializations
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Load profile if not first time
                if (!isFirstTime) {
                    const profileResponse = await doctorService.getDoctorProfile();
                    setProfile(profileResponse.data);
                }
                // Load specializations
                const specializationsResponse = await doctorService.getSpecializations();
                setSpecializations(specializationsResponse.data);
            } catch (error) {
                console.error('Error loading data:', error);
                showNotification('Error loading data', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [isFirstTime]); // Removed showNotification from dependencies

    // Handle input changes
    const handleInputChange = useCallback((field: keyof DoctorProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    // Handle form submission
    const handleSubmit = async () => {
        const validationErrors = validateProfile(profile);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showNotification('Please fix the errors before submitting', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const profileData = {
                name: profile.name!,
                specialization: profile.specialization!,
                price: profile.price!
            };
            await doctorService.updateDoctorProfile(profileData);
            showNotification('Profile saved successfully!', 'success');
            setTimeout(() => {
                navigate(isFirstTime ? '/doctor/dashboard' : '/doctor/manage-profile');
            }, 1500);
        } catch (error: any) {
            console.error('Error saving profile:', error);
            showNotification(
                error.response?.data?.message || 'An error occurred while saving the profile',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const completionPercentage = calculateCompletion(profile);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0 opacity-10"
                     style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                     }}
                ></div>
                <div className="relative px-6 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-6">
                            <div className="text-6xl mb-4">🩺</div>
                            <h1 className="text-4xl font-bold text-white mb-3">
                                {isFirstTime ? 'Complete Your Medical Profile' : 'Update Your Profile'}
                            </h1>
                            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
                                {isFirstTime 
                                    ? 'Set up your professional profile to start helping patients'
                                    : 'Keep your professional information up-to-date'
                                }
                            </p>
                        </div>
                        {/* Progress Indicator */}
                        <div className="max-w-md mx-auto">
                            <div className="flex items-center justify-between text-sm text-purple-200 mb-2">
                                <span>Profile Completion</span>
                                <span className="font-semibold">{completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Form */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Professional Information</h2>
                                <p className="text-gray-600 mt-1">Fill in your details to create your medical profile</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Required fields</div>
                                <div className="text-red-500 text-lg font-bold">*</div>
                            </div>
                        </div>
                    </div>
                    {/* Form Body */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <span className="flex items-center space-x-2">
                                            <span>👨‍⚕️</span>
                                            <span>Full Name *</span>
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 ${
                                                errors.name 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : profile.name?.trim() 
                                                        ? 'border-green-300 bg-green-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            value={profile.name || ''}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Dr. John Smith"
                                        />
                                        {profile.name?.trim() && !errors.name && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.name}</span>
                                        </p>
                                    )}
                                </div>
                                {/* Specialization */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <span className="flex items-center space-x-2">
                                            <span>🏥</span>
                                            <span>Specialization *</span>
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 ${
                                                errors.specialization 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : profile.specialization?.trim() 
                                                        ? 'border-green-300 bg-green-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            value={profile.specialization || ''}
                                            onChange={(e) => handleInputChange('specialization', e.target.value)}
                                        >
                                            <option value="">Select specialization</option>
                                            {specializations.map((spec) => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                        {profile.specialization?.trim() && !errors.specialization && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                    {errors.specialization && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.specialization}</span>
                                        </p>
                                    )}
                                </div>
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <span className="flex items-center space-x-2">
                                            <span>💰</span>
                                            <span>Consultation Fee (USD) *</span>
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={1}
                                            className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 ${
                                                errors.price 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : profile.price && profile.price > 0 
                                                        ? 'border-green-300 bg-green-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            value={profile.price ?? ''}
                                            onChange={(e) => handleInputChange('price', Number(e.target.value))}
                                            placeholder="Enter your consultation fee"
                                        />
                                        {profile.price && profile.price > 0 && !errors.price && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                    {errors.price && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.price}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Right Column (optional for future fields) */}
                            <div></div>
                        </div>
                        {/* Submit Button */}
                        <div className="mt-10 flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {notification && (
                <SimpleNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}
        </div>
    );
};

export default ManageProfile;
