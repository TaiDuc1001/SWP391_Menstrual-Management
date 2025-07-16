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
    experience: number;
    degree: string;
    university: string;
}

interface ProfileFormErrors {
    name?: string;
    specialization?: string;
    price?: string;
    experience?: string;
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
        price: 0,
        experience: 0,
        degree: '',
        university: ''
    });

    const [errors, setErrors] = useState<ProfileFormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (profile && isOpen) {
            setFormData({
                name: profile.name || '',
                specialization: profile.specialization || '',
                price: profile.price || 0,
                experience: profile.experience !== undefined ? profile.experience : 0,
                degree: profile.degree || '',
                university: profile.university || ''
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
        if (!formData.price || formData.price < 100000) {
            newErrors.price = 'Consultation fee must be at least 100,000 VND';
        } else if (formData.price > 1000000) {
            newErrors.price = 'Consultation fee cannot exceed 1,000,000 VND';
        }
        if (formData.experience === undefined || formData.experience < 0) {
            newErrors.experience = 'Experience must be 0 or greater';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof ProfileFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof ProfileFormErrors]) {
            setErrors(prev => ({ ...prev, [field as keyof ProfileFormErrors]: undefined }));
        }
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
                price: formData.price,
                experience: formData.experience,
                degree: formData.degree,
                university: formData.university
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
                price: 0,
                experience: 0,
                degree: '',
                university: ''
            });
            setErrors({});
            setServerError(null);
            onClose();
        }
    };

    const calculateCompletion = (): number => {
        let completed = 0;
        let total = 4;
        if (formData.name.trim().length >= 2) completed++;
        if (formData.specialization.trim()) completed++;
        if (formData.price >= 100000 && formData.price <= 1000000) completed++;
        if (formData.experience !== undefined && formData.experience >= 0) completed++;
        return Math.round((completed / total) * 100);
    };


    const isFormValid = (): boolean => {
        return formData.name.trim().length >= 2 &&
            formData.specialization.trim().length > 0 &&
            formData.price >= 100000 &&
            formData.price <= 1000000 &&
            formData.experience !== undefined && formData.experience >= 0;
    };


    if (!isOpen || !user || !profile) return null;

    const completionPercentage = calculateCompletion();
    const isValid = isFormValid();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
                {}
                <div className="bg-blue-600 px-6 py-4 flex-shrink-0">
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

                {}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-6 flex-1 overflow-y-auto">
                        {}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="flex items-center space-x-2">
                                    <span>🎓</span>
                                    <span>Degree</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.degree}
                                onChange={e => handleInputChange('degree', e.target.value)}
                                placeholder="e.g. MD, PhD, Specialist..."
                                disabled={loading}
                            />
                        </div>
                        {}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="flex items-center space-x-2">
                                    <span>🏫</span>
                                    <span>University</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.university}
                                onChange={e => handleInputChange('university', e.target.value)}
                                placeholder="e.g. Harvard Medical School, Hanoi Medical University..."
                                disabled={loading}
                            />
                        </div>
                        {}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <span className="flex items-center space-x-2">
                                    <span>🎓</span>
                                    <span>Years of Experience *</span>
                                </span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className={`w-full px-4 py-3 text-lg border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                                        errors.experience
                                            ? 'border-red-300 bg-red-50'
                                            : formData.experience !== undefined && formData.experience >= 0
                                                ? 'border-green-300 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    value={formData.experience !== undefined ? formData.experience : ''}
                                    onChange={(e) => handleInputChange('experience', e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value)))}
                                    placeholder="0"
                                />
                                {formData.experience !== undefined && formData.experience >= 0 && !errors.experience && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                                        ✓
                                    </div>
                                )}
                            </div>
                            {errors.experience && (
                                <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                                    <span>⚠️</span>
                                    <span>{errors.experience}</span>
                                </p>
                            )}
                        </div>
                        {serverError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <span className="text-red-700 text-sm">{serverError}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name
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

                            {}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medical Specialization *
                                </label>
                                <select
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.specialization
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

                            {}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Fee (VND) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                        }`}
                                    value={formData.price > 0 ? formData.price : ''}
                                    onChange={(e) => handleInputChange('price', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                                    placeholder="Enter amount between 100,000 and 1,000,000"
                                    disabled={loading}
                                />
                                {errors.price && (
                                    <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                                )}
                                <p className="text-gray-500 text-sm mt-1">
                                    Recommended range: 100,000 - 1,000,000 VND
                                </p>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
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
    );
};

export default EditDoctorProfileModal;

