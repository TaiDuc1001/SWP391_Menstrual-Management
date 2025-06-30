import { useState, useEffect } from 'react';
import { panelService, TestType, CreateTestTypeRequest } from '../services/panelService';

export const useTestTypes = () => {
    const [testTypes, setTestTypes] = useState<TestType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTestTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await panelService.getAllTestTypes();
            setTestTypes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch test types');
            console.error('Error fetching test types:', err);
        } finally {
            setLoading(false);
        }
    };

    const createTestType = async (request: CreateTestTypeRequest): Promise<TestType | null> => {
        try {
            setLoading(true);
            setError(null);
            const newTestType = await panelService.createTestType(request);
            await fetchTestTypes(); // Refresh list
            return newTestType;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create test type');
            console.error('Error creating test type:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteTestType = async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await panelService.deleteTestType(id);
            await fetchTestTypes(); // Refresh list
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete test type');
            console.error('Error deleting test type:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getTestTypeById = async (id: number): Promise<TestType | null> => {
        try {
            setLoading(true);
            setError(null);
            const testType = await panelService.getTestTypeById(id);
            return testType;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch test type details');
            console.error('Error fetching test type details:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch test types when hook is initialized
    useEffect(() => {
        fetchTestTypes();
    }, []);

    return {
        testTypes,
        loading,
        error,
        fetchTestTypes,
        createTestType,
        deleteTestType,
        getTestTypeById,
        setError
    };
};
