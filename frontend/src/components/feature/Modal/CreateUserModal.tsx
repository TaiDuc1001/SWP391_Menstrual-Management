import React, { useState, useEffect } from 'react';
import { CreateAccountRequest } from '../../../api/services/accountService';
import { DoctorProfile } from '../../../api/services/doctorService';
import { SPECIALIZATIONS } from '../../../constants/doctorProfile';

interface DoctorProfileErrors {
    name?: string;
    specialization?: string;
    price?: string;
    experience?: string;
    degree?: string;
    university?: string;
}

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: CreateAccountRequest, doctorProfile?: Partial<DoctorProfile>) => Promise<void>;
    loading?: boolean;
}

const roleOptions = [
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'STAFF', label: 'Staff' },
    { value: 'ADMIN', label: 'Admin' }
];

const CreateUserModal: React.FC<CreateUserModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    loading = false
}) => {
    const [formData, setFormData] = useState<CreateAccountRequest>({
        email: '',
        password: '',
        role: 'CUSTOMER',
        name: '',
        phoneNumber: '',
        status: true
    });

    const [doctorProfileData, setDoctorProfileData] = useState<Partial<DoctorProfile>>({
        name: '',
        specialization: '',
        price: 0,
        experience: 0,
        degree: '',
        university: ''
    });

    const [errors, setErrors] = useState<Partial<CreateAccountRequest>>({});
    const [doctorProfileErrors, setDoctorProfileErrors] = useState<DoctorProfileErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateAccountRequest> = {};
        const newDoctorProfileErrors: DoctorProfileErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.name) {
            newErrors.name = 'Name is required';
        }

        if (formData.role === 'CUSTOMER') {
            if (!formData.phoneNumber) {
                newErrors.phoneNumber = 'Phone number is required';
            } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
                newErrors.phoneNumber = 'Phone number must be 10 digits starting with 0.';
            }
        }

        // Validate doctor profile if role is DOCTOR
        if (formData.role === 'DOCTOR') {
            if (!doctorProfileData.specialization) {
                newDoctorProfileErrors.specialization = 'Specialization is required';
            }
            if (!doctorProfileData.price || doctorProfileData.price <= 0 || doctorProfileData.price < 100000 || doctorProfileData.price > 1000000) {
                newDoctorProfileErrors.price = 'Price must be between 100,000 and 1,000,000 VND';
            }
            if (doctorProfileData.experience === undefined || doctorProfileData.experience < 0) {
                newDoctorProfileErrors.experience = 'Experience must be 0 or greater';
            }
        }


        setErrors(newErrors);
        setDoctorProfileErrors(newDoctorProfileErrors);
        return Object.keys(newErrors).length === 0 && Object.keys(newDoctorProfileErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setServerError(null);

        try {
            // For non-customer roles, ensure phone number is empty
            const submitData = { ...formData };
            if (formData.role !== 'CUSTOMER') {
                submitData.phoneNumber = '';
            }

            // Prepare doctor profile data if role is DOCTOR
            const doctorData = formData.role === 'DOCTOR' ? {
                ...doctorProfileData,
                name: formData.name 
            } : undefined;

            await onSubmit(submitData, doctorData);
            handleClose();
        } catch (error: any) {
            console.error('Error creating user:', error);
            const errorMessage = error.message || 'Failed to create user. Please try again.';
            setServerError(errorMessage);
        }
    };

    const handleClose = () => {
        setFormData({
            email: '',
            password: '',
            role: 'CUSTOMER',
            name: '',
            phoneNumber: '',
            status: true
        });
        setDoctorProfileData({
            name: '',
            specialization: '',
            price: 0,
            experience: 0,
            degree: '',
            university: ''
        });
        setErrors({});
        setDoctorProfileErrors({});
        setServerError(null);
        setIsRoleDropdownOpen(false);
        onClose();
    };

    const handleInputChange = (field: keyof CreateAccountRequest, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Update doctor profile name when user name changes
        if (field === 'name' && typeof value === 'string') {
            setDoctorProfileData(prev => ({
                ...prev,
                name: value
            }));
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }

        // Clear server error when user starts typing
        if (serverError) {
            setServerError(null);
        }
    };

    const handleDoctorProfileChange = (field: keyof DoctorProfile, value: string | number) => {
        setDoctorProfileData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (field in doctorProfileErrors && doctorProfileErrors[field as keyof DoctorProfileErrors]) {
            setDoctorProfileErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }

        // Clear server error when user starts typing
        if (serverError) {
            setServerError(null);
        }
    };

    const handleRoleSelect = (role: CreateAccountRequest['role']) => {
        handleInputChange('role', role);
        setIsRoleDropdownOpen(false);
    };

    const selectedRole = roleOptions.find(option => option.value === formData.role);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.role-dropdown')) {
                setIsRoleDropdownOpen(false);
            }
        };

        if (isRoleDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isRoleDropdownOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Create New User</h2>
                            <p className="text-sm text-gray-600">Add a new user to the system</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                            disabled={loading}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {serverError && (
                        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* User Information Section */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        User Information
                                    </h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-300 bg-red-50' : ''
                                                    }`}
                                                placeholder="Enter full name"
                                                autoComplete="off"
                                                disabled={loading}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.name}
                                            </p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email || (serverError && serverError.toLowerCase().includes('email')) ? 'border-red-300 bg-red-50' : ''
                                                    }`}
                                                placeholder="Enter email address"
                                                autoComplete="off"
                                                disabled={loading}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.email}
                                            </p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Security Section */}
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Security
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.password ? 'border-red-300 bg-red-50' : ''
                                                }`}
                                            placeholder="Enter password"
                                            autoComplete="new-password"
                                            disabled={loading}
                                        />
                                        {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.password}
                                        </p>}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Contact & Role Section */}
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Role & Settings
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="relative role-dropdown">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Role *
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 flex items-center justify-between"
                                                disabled={loading}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${formData.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                        formData.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                                                            formData.role === 'DOCTOR' ? 'bg-green-100 text-green-800' :
                                                                'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {selectedRole?.label}
                                                    </span>
                                                </div>
                                                <svg
                                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {isRoleDropdownOpen && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                                                    {roleOptions.map((option) => (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => handleRoleSelect(option.value as CreateAccountRequest['role'])}
                                                            className={`w-full px-3 py-2 text-left hover:bg-orange-50 focus:bg-orange-50 focus:outline-none flex items-center transition-colors duration-150 ${formData.role === option.value
                                                                ? 'bg-orange-100 text-orange-900'
                                                                : 'text-gray-900'
                                                                }`}
                                                        >
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2 ${option.value === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                                option.value === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                                                                    option.value === 'DOCTOR' ? 'bg-green-100 text-green-800' :
                                                                        'bg-purple-100 text-purple-800'
                                                                }`}>
                                                                {option.label}
                                                            </span>
                                                            {formData.role === option.value && (
                                                                <svg
                                                                    className="w-4 h-4 text-orange-600 ml-auto"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>                                        {formData.role === 'CUSTOMER' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => {
                                                        // Only allow digits and ensure it starts with 0
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        if (value.length <= 10 && (value === '' || value.startsWith('0'))) {
                                                            handleInputChange('phoneNumber', value);
                                                        }
                                                    }}
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${errors.phoneNumber ? 'border-red-300 bg-red-50' : ''
                                                        }`}
                                                    placeholder="0123456789"
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    maxLength={10}
                                                />
                                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {errors.phoneNumber}
                                                </p>}
                                            </div>
                                        )}

                                        <div className="flex items-center bg-white rounded-lg p-2 border border-gray-200">
                                            <input
                                                type="checkbox"
                                                id="status"
                                                checked={formData.status}
                                                onChange={(e) => handleInputChange('status', e.target.checked)}
                                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                disabled={loading}
                                            />
                                            <label htmlFor="status" className="ml-2 flex items-center">
                                                <span className="text-sm font-medium text-gray-900">Active status</span>
                                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${formData.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {formData.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Profile Section - Only show when role is DOCTOR */}
                                {formData.role === 'DOCTOR' && (
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Doctor Profile
                                        </h3>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Specialization *
                                                </label>
                                                <select
                                                    value={doctorProfileData.specialization || ''}
                                                    onChange={(e) => handleDoctorProfileChange('specialization', e.target.value)}
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${doctorProfileErrors.specialization ? 'border-red-300 bg-red-50' : ''
                                                        }`}
                                                    disabled={loading}
                                                >
                                                    <option value="">Select specialization</option>
                                                    {SPECIALIZATIONS.map((specialization) => (
                                                        <option key={specialization} value={specialization}>
                                                            {specialization}
                                                        </option>
                                                    ))}
                                                </select>
                                                {doctorProfileErrors.specialization && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {doctorProfileErrors.specialization}
                                                </p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Years of Experience *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={doctorProfileData.experience !== undefined ? doctorProfileData.experience : ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0);
                                                        handleDoctorProfileChange('experience', value);
                                                    }}
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${doctorProfileErrors.experience ? 'border-red-300 bg-red-50' : ''
                                                        }`}
                                                    placeholder="0"
                                                    min="0"
                                                    step="1"
                                                    disabled={loading}
                                                />
                                                {doctorProfileErrors.experience && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {doctorProfileErrors.experience}
                                                </p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Degree
                                                </label>
                                                <input
                                                    type="text"
                                                    value={doctorProfileData.degree || ''}
                                                    onChange={(e) => handleDoctorProfileChange('degree', e.target.value)}
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${doctorProfileErrors.degree ? 'border-red-300 bg-red-50' : ''
                                                        }`}
                                                    placeholder="e.g. MD, PhD, Specialist..."
                                                    disabled={loading}
                                                />
                                                {doctorProfileErrors.degree && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {doctorProfileErrors.degree}
                                                </p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    University
                                                </label>
                                                <input
                                                    type="text"
                                                    value={doctorProfileData.university || ''}
                                                    onChange={(e) => handleDoctorProfileChange('university', e.target.value)}
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${doctorProfileErrors.university ? 'border-red-300 bg-red-50' : ''
                                                        }`}
                                                    placeholder="e.g. Harvard Medical School, Hanoi Medical University..."
                                                    disabled={loading}
                                                />
                                                {doctorProfileErrors.university && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {doctorProfileErrors.university}
                                                </p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Consultation Price (VND) *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={doctorProfileData.price || ''}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value) || 0;
                                                        handleDoctorProfileChange('price', value);
                                                    }}
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${doctorProfileErrors.price ? 'border-red-300 bg-red-50' : ''
                                                        }`}
                                                    placeholder="100000"
                                                    min="100000"
                                                    max="1000000"
                                                    step="50000"
                                                    disabled={loading}
                                                />
                                                {doctorProfileErrors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {doctorProfileErrors.price}
                                                </p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create User
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;
