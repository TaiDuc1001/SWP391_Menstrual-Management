import { useState, useEffect, useCallback } from 'react';
import { cycleService, CycleData, CycleCreationRequest } from '../services/cycleService';
import { aiService, AIRecommendationRequest } from '../services/aiService';

export const useCycles = () => {
    const [cycles, setCycles] = useState<CycleData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCycles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cycleService.getAllCycles();
            setCycles(data);
        } catch (err) {
            setError('Failed to fetch cycles');
            console.error('Error fetching cycles:', err);
        } finally {
            setLoading(false);
        }
    };

    const createCycle = async (cycleData: CycleCreationRequest) => {
        setLoading(true);
        setError(null);
        try {
            const newCycle = await cycleService.createCycle(cycleData);
            setCycles(prev => [...prev, newCycle]);
            return newCycle;
        } catch (err) {
            setError('Failed to create cycle');
            console.error('Error creating cycle:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getClosestCycle = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cycleService.getClosestCycle();
            return data;
        } catch (err) {
            setError('Failed to fetch closest cycle');
            console.error('Error fetching closest cycle:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };    const deleteAllCycles = async () => {
        setLoading(true);
        setError(null);
        try {
            await cycleService.deleteAllCycles();
            setCycles([]);
        } catch (err) {
            setError('Failed to delete cycles');
            console.error('Error deleting cycles:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const predictCycleForMonth = async (year: number, month: number) => {
        setLoading(true);
        setError(null);
        try {
            const prediction = await cycleService.predictCycleForMonth(year, month);
            return prediction;
        } catch (err) {
            setError('Failed to predict cycle for month');
            console.error('Error predicting cycle for month:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCycles();
    }, []);

    return {
        cycles,
        loading,
        error,
        refetch: fetchCycles,
        createCycle,
        deleteAllCycles,
        getClosestCycle,
        predictCycleForMonth
    };
};

export const useAIRecommendations = () => {
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);    const generateRecommendations = useCallback(async (
        cycles: CycleData[], 
        symptoms: { [key: string]: { symptom: string; period: string; flow: string } }
    ) => {
        setLoading(true);
        setError(null);
        
        try {
            const recentSymptoms: string[] = [];
            
            Object.values(symptoms).forEach(symptomData => {
                if (symptomData.symptom && symptomData.symptom !== 'None') {
                    recentSymptoms.push(symptomData.symptom);
                }
            });
            
            const cycleData = cycles.map(cycle => {
                const cycleSymptoms: string[] = [];
                
                if (cycle.cycleSymptomByDate) {
                    cycle.cycleSymptomByDate.forEach(symptomData => {
                        if (symptomData.symptom && symptomData.symptom !== 'OTHER') {
                            const symptomName = symptomData.symptom.toLowerCase().replace('_', ' ');
                            cycleSymptoms.push(symptomName);
                            recentSymptoms.push(symptomName);
                        }
                    });
                }
                
                const cycleStartDate = new Date(cycle.cycleStartDate);
                const cycleEndDate = new Date(cycleStartDate.getTime() + cycle.periodDuration * 24 * 60 * 60 * 1000);
                
                Object.entries(symptoms).forEach(([dateKey, symptomData]) => {
                    const symptomDate = new Date(dateKey);
                    if (symptomDate >= cycleStartDate && symptomDate <= cycleEndDate) {
                        if (symptomData.symptom && symptomData.symptom !== 'None') {
                            cycleSymptoms.push(symptomData.symptom);
                        }
                    }
                });

                return {
                    cycleStartDate: cycle.cycleStartDate,
                    cycleLength: cycle.cycleLength,
                    periodDuration: cycle.periodDuration,
                    symptoms: cycleSymptoms
                };
            });

            const requestData: AIRecommendationRequest = {
                cycles: cycleData,
                recentSymptoms: Array.from(new Set(recentSymptoms))
            };

            console.log('Sending data to AI:', requestData);

            const aiRecommendations = await aiService.getRecommendations(requestData);
            setRecommendations(aiRecommendations);
        } catch (err) {
            setError('Failed to generate recommendations');
            console.error('Error generating recommendations:', err);
            setRecommendations(aiService.getFallbackRecommendations());
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        recommendations,
        loading,
        error,
        generateRecommendations
    };
};
