import React, { useState } from 'react';
import { mockDoctorService } from '../api/services/mockDoctorService';

const TestProfileForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        price: 0
    });
    const [result, setResult] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseInt(value) || 0 : value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await mockDoctorService.updateDoctorProfile(formData);
            setResult(`Profile saved: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            setResult(`Error: ${error}`);
        }
    };

    const handleLoad = async () => {
        try {
            const response = await mockDoctorService.getDoctorProfile();
            setResult(`Profile loaded: ${JSON.stringify(response.data, null, 2)}`);
            setFormData({
                name: response.data.name || '',
                specialization: response.data.specialization || '',
                price: response.data.price || 0
            });
        } catch (error) {
            setResult(`Error: ${error}`);
        }
    };

    const handleClear = () => {
        mockDoctorService.clearProfile();
        setResult('Profile cleared from localStorage');
        setFormData({
            name: '',
            specialization: '',
            price: 0
        });
    };

    const handleSetComplete = async () => {
        try {
            const completeProfile = mockDoctorService.getCompleteMockProfile();
            const response = await mockDoctorService.updateDoctorProfile(completeProfile);
            setResult(`Complete profile set: ${JSON.stringify(response.data, null, 2)}`);
            setFormData({
                name: completeProfile.name,
                specialization: completeProfile.specialization,
                price: completeProfile.price
            });
        } catch (error) {
            setResult(`Error: ${error}`);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Test Profile Form</h2>
            
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter doctor name"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Specialization:</label>
                    <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select specialization</option>
                        <option value="Gynecology">Gynecology</option>
                        <option value="Urology">Urology</option>
                        <option value="Infectious Diseases">Infectious Diseases</option>
                        <option value="Sexual Health">Sexual Health</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Price (USD):</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter consultation fee"
                        min="0"
                        step="5"
                    />
                </div>
            </div>
            
            <div className="flex gap-2 mb-4">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Save Profile
                </button>
                <button
                    onClick={handleLoad}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Load Profile
                </button>
                <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Clear Profile
                </button>
                <button
                    onClick={handleSetComplete}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                    Set Complete Profile
                </button>
            </div>
            
            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="font-bold mb-2">Result:</h3>
                    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default TestProfileForm;
