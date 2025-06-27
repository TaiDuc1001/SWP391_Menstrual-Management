import React, { useState } from 'react';
import { mockDoctorService } from '../api/services/mockDoctorService';

const TestProfileForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        qualification: '',
        description: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            console.log('Form data to submit:', formData);
            
            const response = await mockDoctorService.updateDoctorProfile(formData);
            console.log('Save response:', response);
            
            setMessage('✅ Profile saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            setMessage('❌ Error saving profile');
        } finally {
            setSaving(false);
        }
    };

    const loadProfile = async () => {
        try {
            const response = await mockDoctorService.getDoctorProfile();
            console.log('Loaded profile:', response.data);
            
            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                specialization: response.data.specialization || '',
                qualification: response.data.qualification || '',
                description: response.data.description || ''
            });
            
            setMessage('✅ Profile loaded');
        } catch (error) {
            console.error('Load error:', error);
            setMessage('❌ Error loading profile');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Test Profile Form</h2>
            
            {message && (
                <div className="mb-4 p-3 rounded bg-gray-100">
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter your phone"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization
                    </label>
                    <select
                        value={formData.specialization}
                        onChange={(e) => handleChange('specialization', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select specialization</option>
                        <option value="Sản phụ khoa">Sản phụ khoa</option>
                        <option value="Nội khoa">Nội khoa</option>
                        <option value="Tâm lý học">Tâm lý học</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualification
                    </label>
                    <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => handleChange('qualification', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter your qualification"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows={4}
                        placeholder="Enter description"
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={loadProfile}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Load Profile
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => {
                            mockDoctorService.clearProfile();
                            setFormData({
                                name: '',
                                email: '',
                                phone: '',
                                specialization: '',
                                qualification: '',
                                description: ''
                            });
                            setMessage('✅ Profile cleared');
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Clear Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestProfileForm;
