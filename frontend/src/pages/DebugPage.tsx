import React, { useState, useEffect } from 'react';
import { mockDoctorService } from '../api/services/mockDoctorService';
import { API_CONFIG } from '../config/api';

const DebugPage: React.FC = () => {
    const [profileData, setProfileData] = useState<any>(null);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDebugData = async () => {
            try {
                setLoading(true);
                
                // Test all API calls
                const [profileRes, completeRes, specsRes] = await Promise.all([
                    mockDoctorService.getDoctorProfile(),
                    mockDoctorService.checkProfileComplete(),
                    mockDoctorService.getSpecializations()
                ]);

                setProfileData(profileRes.data);
                setIsComplete(completeRes.data.isComplete);
                setSpecializations(specsRes.data);
            } catch (error) {
                console.error('Debug data loading error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDebugData();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
                <p>Loading debug data...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
            
            {/* Configuration */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                <div className="space-y-2">
                    <p><strong>Use Mock API:</strong> {API_CONFIG.USE_MOCK_API ? 'Yes' : 'No'}</p>
                    <p><strong>API Base URL:</strong> {API_CONFIG.API_BASE_URL}</p>
                    <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                </div>
            </div>

            {/* Profile Status */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Profile Status</h2>
                <div className="space-y-2">
                    <p><strong>Profile Complete:</strong> {isComplete ? 'Yes' : 'No'}</p>
                    <p><strong>Profile ID:</strong> {profileData?.id}</p>
                    <p><strong>Name:</strong> {profileData?.name}</p>
                    <p><strong>Email:</strong> {profileData?.email}</p>
                </div>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Specializations</h2>
                <div className="grid grid-cols-2 gap-2">
                    {specializations.map((spec, index) => (
                        <div key={index} className="bg-gray-100 p-2 rounded">
                            {spec}
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Profile Data */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Full Profile Data</h2>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(profileData, null, 2)}
                </pre>
            </div>

            {/* Navigation Links */}
            <div className="mt-6 space-x-4">
                <a href="/test-form" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                    Test Form
                </a>
                <a href="/doctor/setup-profile" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Setup Profile
                </a>
                <a href="/doctor/manage-profile" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Manage Profile
                </a>
                <a href="/doctor/profile" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    View Profile
                </a>
                <a href="/doctor/dashboard" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                    Dashboard
                </a>
            </div>

            {/* Testing Utilities */}
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Testing Utilities</h3>
                <div className="space-x-2">
                    <button 
                        onClick={() => {
                            mockDoctorService.clearProfile();
                            window.location.reload();
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                        Clear Profile
                    </button>
                    <button 
                        onClick={() => {
                            mockDoctorService.setCompleteProfile();
                            window.location.reload();
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                        Set Complete Profile
                    </button>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DebugPage;
