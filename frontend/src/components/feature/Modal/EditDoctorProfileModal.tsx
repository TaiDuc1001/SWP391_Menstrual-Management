import React, { useState, useEffect } from 'react';
import { DoctorProfile } from '../../../api/services/doctorService';
import { AccountForUI } from '../../../api/services/accountService';
import { SPECIALIZATIONS } from '../../../constants/doctorProfile';

interface EditDoctorProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (profileData: Partial<DoctorProfile>) => Promise<void>;
    loading?: boolean;
    user: AccountForUI | null;
    profile: DoctorProfile | null;
}

interface ProfileFormData {
    name: string;
    specialization: string;
    price: number;
}

interface ProfileFormErrors {
    name?: string;
    specialization?: string;
    price?: string;
}

const EditDoctorProfileModal: React.FC<EditDoctorProfileModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    loading = false,
    user,
    profile
}) => {
    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        specialization: '',
        price: 0
    });

    const [errors, setErrors] = useState<ProfileFormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (profile && isOpen) {
            setFormData({
                name: profile.name || '',
                specialization: profile.specialization || '',
                price: profile.price || 0
            });
            setErrors({});
            setServerError(null);
        }
    }, [profile, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: ProfileFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.specialization.trim()) {
            newErrors.specialization = 'Specialization is required';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Consultation fee must be greater than 0';
        } else if (formData.price > 2000000) {
            newErrors.price = 'Consultation fee cannot exceed 2,000,000 VND';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof ProfileFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field as keyof ProfileFormErrors]) {
            setErrors(prev => ({ ...prev, [field as keyof ProfileFormErrors]: undefined }));
        }
        
        // Clear server error
        if (serverError) {
            setServerError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setServerError(null);
            await onSubmit({
                name: formData.name.trim(),
                specialization: formData.specialization.trim(),
                price: formData.price
            });
            onClose();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setServerError(error.message || 'Failed to update doctor profile. Please try again.');
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                name: '',
                specialization: '',
                price: 0
            });
            setErrors({});
            setServerError(null);
            onClose();
        }
    };

    const calculateCompletion = (): number => {
        let completed = 0;
        let total = 3;
        
        if (formData.name.trim()) completed++;
        if (formData.specialization.trim()) completed++;
        if (formData.price > 0) completed++;
        
        return Math.round((completed / total) * 100);
    };

    const isFormValid = (): boolean => {
        return formData.name.trim().length >= 2 && 
               formData.specialization.trim().length > 0 && 
               formData.price > 0 && 
               formData.price <= 2000000;
    };

    if (!isOpen || !user || !profile) return null;

    const completionPercentage = calculateCompletion();
    const isValid = isFormValid();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <h2 className="text-xl font-semibold">Edit Doctor Profile</h2>
                            <p className="text-blue-100 text-sm">Update information for Dr. {user.name}</p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        {serverError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <span className="text-red-700 text-sm">{serverError}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300'
                                    }`}
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter doctor's full name"
                                    disabled={loading}
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medical Specialization *
                                </label>
                                <select
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.specialization 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300'
                                    }`}
                                    value={formData.specialization}
                                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Choose specialization...</option>
                                    {SPECIALIZATIONS.map((spec) => (
                                        <option key={spec} value={spec}>
                                            {spec}
                                        </option>
                                    ))}
                                </select>
                                {errors.specialization && (
                                    <p className="text-red-600 text-sm mt-1">{errors.specialization}</p>
                                )}
                            </div>

                            {/* Consultation Fee */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Fee (VND) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.price 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300'
                                    }`}
                                    value={formData.price > 0 ? formData.price : ''}
                                    onChange={(e) => handleInputChange('price', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                                    placeholder="500000"
                                    disabled={loading}
                                />
                                {errors.price && (
                                    <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                                )}
                                <p className="text-gray-500 text-sm mt-1">
                                    Recommended range: 200,000 - 2,000,000 VND
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isValid}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Profile</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDoctorProfileModal;
