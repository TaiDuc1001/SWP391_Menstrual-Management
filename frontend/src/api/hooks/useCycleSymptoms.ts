import { useState, useEffect, useCallback } from 'react';
import { cycleSymptomService, CycleSymptomRequest, CycleSymptomResponse } from '../services/cycleSymptomService';

export const useCycleSymptoms = () => {
    const [symptoms, setSymptoms] = useState<CycleSymptomResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSymptoms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cycleSymptomService.getAllSymptoms();
            setSymptoms(data);
        } catch (err) {
            setError('Failed to fetch symptoms');
            console.error('Error fetching symptoms:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveSymptom = useCallback(async (symptomData: CycleSymptomRequest) => {
        setLoading(true);
        setError(null);
        try {
            // First, delete any existing symptoms for this date
            await cycleSymptomService.deleteSymptomsByDate(symptomData.date);
            
            // Then save the new symptom if it's not "None"
            if (symptomData.symptom !== 'None') {
                const savedSymptom = await cycleSymptomService.saveSymptom(symptomData);
                setSymptoms(prev => {
                    // Remove any existing symptoms for this date and add the new one
                    const filtered = prev.filter(s => 
                        new Date(s.date).toDateString() !== new Date(symptomData.date).toDateString()
                    );
                    return [...filtered, savedSymptom];
                });
            } else {
                // If symptom is "None", just remove any existing symptoms for this date
                setSymptoms(prev => prev.filter(s => 
                    new Date(s.date).toDateString() !== new Date(symptomData.date).toDateString()
                ));
            }
        } catch (err) {
            setError('Failed to save symptom');
            console.error('Error saving symptom:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteSymptomsByDate = useCallback(async (date: string) => {
        setLoading(true);
        setError(null);
        try {
            await cycleSymptomService.deleteSymptomsByDate(date);
            setSymptoms(prev => prev.filter(s => 
                new Date(s.date).toDateString() !== new Date(date).toDateString()
            ));
        } catch (err) {
            setError('Failed to delete symptoms');
            console.error('Error deleting symptoms:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getSymptomForDate = useCallback((date: string) => {
        const dateObj = new Date(date);
        return symptoms.find(s => 
            new Date(s.date).toDateString() === dateObj.toDateString()
        );
    }, [symptoms]);

    const hasSymptomForDate = useCallback((date: string) => {
        return !!getSymptomForDate(date);
    }, [getSymptomForDate]);

    useEffect(() => {
        fetchSymptoms();
    }, [fetchSymptoms]);

    return {
        symptoms,
        loading,
        error,
        saveSymptom,
        deleteSymptomsByDate,
        getSymptomForDate,
        hasSymptomForDate,
        refetch: fetchSymptoms
    };
};
