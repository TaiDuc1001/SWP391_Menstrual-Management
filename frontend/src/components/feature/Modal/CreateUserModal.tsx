import React, { useState } from 'react';
import { CreateAccountRequest } from '../../../api/services/accountService';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: CreateAccountRequest) => Promise<void>;
    loading?: boolean;
}

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

    const [errors, setErrors] = useState<Partial<CreateAccountRequest>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateAccountRequest> = {};

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

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10,11}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10-11 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error('Error creating user:', error);
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
        setErrors({});
        onClose();
    };

    const handleInputChange = (field: keyof CreateAccountRequest, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter full name"
                            disabled={loading}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter email address"
                            disabled={loading}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter password"
                            disabled={loading}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter phone number"
                            disabled={loading}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role *
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value as CreateAccountRequest['role'])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="DOCTOR">Consultant</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Manager</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="status"
                            checked={formData.status}
                            onChange={(e) => handleInputChange('status', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={loading}
                        />
                        <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
                            Active status
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
