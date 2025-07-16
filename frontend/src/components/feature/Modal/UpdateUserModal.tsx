import React, { useState, useEffect } from 'react';
import { UpdateAccountRequest, AccountForUI } from '../../../api/services/accountService';

interface UpdateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: UpdateAccountRequest) => Promise<void>;
    loading?: boolean;
    user: AccountForUI | null;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    loading = false,
    user 
}) => {
    const [formData, setFormData] = useState<UpdateAccountRequest>({
        email: '',
        password: '',
        name: '',
        phoneNumber: '',
        status: true
    });

    const [errors, setErrors] = useState<Partial<UpdateAccountRequest>>({});
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                email: user.email || '',
                password: '',
                name: user.name || '',
                phoneNumber: user.phone === 'N/A' || !user.phone ? '' : user.phone,
                status: user.status === 'Active'
            });
            setErrors({});
            setServerError(null);
        }
    }, [user, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Partial<UpdateAccountRequest> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.name) {
            newErrors.name = 'Name is required';
        }

        if (user?.role === 'CUSTOMER') {
            if (!formData.phoneNumber) {
                newErrors.phoneNumber = 'Phone number is required';
            } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
                newErrors.phoneNumber = 'Phone number must be 10 digits starting with 0.';
            }
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setServerError(null); 

        try {
            const submitData = { ...formData };
            if (!submitData.password || submitData.password.trim() === '') {
                delete (submitData as any).password;
            }
            
            if (user?.role !== 'CUSTOMER') {
                submitData.phoneNumber = '';
            }
            
            console.log('Updating user with data:', submitData);
            console.log('User ID:', user?.id);
            console.log('Original user data:', user);
            
            await onSubmit(submitData);
            handleClose();
        } catch (error: any) {
            console.error('Error updating user:', error);
            console.error('Error details:', error);
            const errorMessage = error.message || 'Failed to update user. Please try again.';
            setServerError(errorMessage);
        }
    };

    const handleClose = () => {
        setFormData({
            email: '',
            password: '',
            name: '',
            phoneNumber: '',
            status: true
        });
        setErrors({});
        setServerError(null);
        onClose();
    };

    const handleInputChange = (field: keyof UpdateAccountRequest, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }

        if (serverError) {
            setServerError(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Update User</h2>
                            <p className="text-sm text-gray-600">Modify user information and settings</p>
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

                {}
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
                            {}
                            <div className="space-y-4">
                                {}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.name ? 'border-red-300 bg-red-50' : ''
                                                }`}
                                                placeholder="Enter full name"
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
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.email || (serverError && serverError.toLowerCase().includes('email')) ? 'border-red-300 bg-red-50' : ''
                                                }`}
                                                placeholder="Enter email address"
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

                                {}
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Security
                                    </h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password (leave blank to keep current)
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                                errors.password ? 'border-red-300 bg-red-50' : ''
                                            }`}
                                            placeholder="Enter new password"
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

                            {}
                            <div className="space-y-4">
                                {}
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Contact & Settings
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Role
                                            </label>
                                            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                    user?.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                    user?.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                                                    user?.role === 'DOCTOR' ? 'bg-green-100 text-green-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {user?.role === 'ADMIN' ? 'Admin' :
                                                     user?.role === 'STAFF' ? 'Staff' :
                                                     user?.role === 'DOCTOR' ? 'Doctor' :
                                                     'Customer'}
                                                </span>
                                            </div>
                                        </div>

                                        {user?.role === 'CUSTOMER' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => {

                                                        const value = e.target.value.replace(/\D/g, '');
                                                        if (value.length <= 10 && (value === '' || value.startsWith('0'))) {
                                                            handleInputChange('phoneNumber', value);
                                                        }
                                                    }}
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                                        errors.phoneNumber ? 'border-red-300 bg-red-50' : ''
                                                    }`}
                                                    placeholder="0123456789"
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
                                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                    formData.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {formData.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {}
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
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Update User
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserModal;

