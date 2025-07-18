import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { DoctorProfile } from '../../api/services/doctorService';
import { useDoctorProfile } from '../../api/hooks/useDoctorProfile';
import { SimpleNotification, useSimpleNotification } from '../../components/common/SimpleNotification';

interface ManageProfileProps {
    isFirstTime?: boolean;
}

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
    const { profile: loadedProfile, loading, updateProfile } = useDoctorProfile();
    
    const [profile, setProfile] = useState<Partial<DoctorProfile>>({
        name: '',
        specialization: '',
        price: undefined,
        degree: '',
        university: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (loadedProfile && !isFirstTime) {
            setProfile(loadedProfile);
        }
    }, [loadedProfile, isFirstTime]);

    useEffect(() => {
        setSpecializations([
            'Gynecology',
            'Urology', 
            'Endocrinology',
            'Psychiatry',
            'Nutrition',
            'Family Medicine',
            'Dermatology',
            'Cardiology',
            'Gastroenterology',
            'Pulmonology',
            'Infectious Diseases',
            'Sexual Health',
            'Reproductive Health',
            'Women\'s Health'
        ]);
    }, []);

    const handleInputChange = useCallback((field: keyof DoctorProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

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
                price: profile.price!,
                experience: profile.experience ?? 0,
                degree: profile.degree ?? '',
                university: profile.university ?? ''
            };

            await updateProfile(profileData);
            showNotification('Profile saved successfully!', 'success');
            
            setTimeout(() => {
                navigate(isFirstTime ? '/doctor/dashboard' : '/doctor/profile');
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
            {}
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

                        {}
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

            {}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {}
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

                    {}
                    <div className="p-8">
                        {}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                <span className="flex items-center space-x-2">
                                    <span>🎓</span>
                                    <span>Degree</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white border-gray-200 hover:border-gray-300"
                                value={profile.degree || ''}
                                onChange={e => handleInputChange('degree', e.target.value)}
                                placeholder="e.g. MD, PhD, Specialist..."
                            />
                        </div>
                        {}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                <span className="flex items-center space-x-2">
                                    <span>🏫</span>
                                    <span>University</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white border-gray-200 hover:border-gray-300"
                                value={profile.university || ''}
                                onChange={e => handleInputChange('university', e.target.value)}
                                placeholder="e.g. Harvard Medical School, Hanoi Medical University..."
                            />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {}
                            <div className="space-y-6">
                                {}
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

                                {}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <span className="flex items-center space-x-2">
                                            <span>🔬</span>
                                            <span>Medical Specialization *</span>
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 appearance-none bg-white ${
                                                errors.specialization 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : profile.specialization?.trim() 
                                                        ? 'border-green-300 bg-green-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            value={profile.specialization || ''}
                                            onChange={(e) => handleInputChange('specialization', e.target.value)}
                                        >
                                            <option value="">Choose your specialization...</option>
                                            {specializations.map((spec) => (
                                                <option key={spec} value={spec}>
                                                    {spec}
                                                </option>
                                            ))}
                                        </select>
                                        {profile.specialization?.trim() && !errors.specialization && (
                                            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500">
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
                            </div>

                            {}
                            <div className="space-y-6">
                                {}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <span className="flex items-center space-x-2">
                                            <span>💰</span>
                                            <span>Consultation Fee (VND) *</span>
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-semibold">
                                            ₫
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            step="10000"
                                            className={`w-full pl-8 pr-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 ${
                                                errors.price 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : profile.price && profile.price > 0 
                                                        ? 'border-green-300 bg-green-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            value={profile.price && profile.price > 0 ? profile.price : ''}
                                            onChange={(e) => handleInputChange('price', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                                            placeholder="500000"
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

                                {}
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                        <span>👁️</span>
                                        <span>Profile Preview</span>
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-600">Name: </span>
                                            <span className="font-medium text-gray-800">
                                                {profile.name || 'Not set'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Specialization: </span>
                                            <span className="font-medium text-gray-800">
                                                {profile.specialization || 'Not set'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Fee: </span>
                                            <span className="font-medium text-green-600">
                                                {profile.price ? profile.price.toLocaleString('vi-VN') : '0'} VND
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t border-purple-200">
                                            <span className="text-gray-600">Completion: </span>
                                            <span className={`font-semibold ${
                                                completionPercentage === 100 
                                                    ? 'text-green-600' 
                                                    : 'text-orange-600'
                                            }`}>
                                                {completionPercentage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="mt-12 text-center">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Saving Profile...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center space-x-2">
                                        <span>✨</span>
                                        <span>{isFirstTime ? 'Complete Profile & Get Started' : 'Save Changes'}</span>
                                    </span>
                                )}
                            </Button>
                            
                            {!isFirstTime && (
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/doctor/profile')}
                                        className="text-gray-600 hover:text-gray-800 underline transition-colors"
                                    >
                                        Cancel and go back
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
                
            {}
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

