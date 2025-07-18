import { useState, useEffect, useCallback } from 'react';
import { cycleService, CycleData, CycleCreationRequest } from '../services/cycleService';
import { aiService, AIRecommendationRequest, AIRecommendationResponse } from '../services/aiService';

export const useCycles = () => {
    const [cycles, setCycles] = useState<CycleData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCycles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cycleService.getAllCycles();
            console.log('Fetched cycles from backend:', data);
            setCycles(data);
        } catch (err) {
            setError('Failed to fetch cycles');
            console.error('Error fetching cycles:', err);

            setCycles([]);
        } finally {
            setLoading(false);
        }
    };

    const createCycle = async (cycleData: CycleCreationRequest) => {
        setLoading(true);
        setError(null);
        try {
            const newCycle = await cycleService.createCycle(cycleData);
            setCycles(prev => {
                const updated = [...prev, newCycle];
                return updated;
            });
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

    const deleteCyclesForMonth = async (year: number, month: number) => {
        setLoading(true);
        setError(null);
        try {
            const updatedCycles = cycles.filter(cycle => {
                const cycleDate = new Date(cycle.cycleStartDate);
                return !(cycleDate.getFullYear() === year && cycleDate.getMonth() === month);
            });
            
            await cycleService.deleteAllCycles();
            
            for (const cycle of updatedCycles) {
                await cycleService.createCycle({
                    startDate: cycle.cycleStartDate,
                    cycleLength: cycle.cycleLength,
                    periodDuration: cycle.periodDuration
                });
            }
            
            setCycles(updatedCycles);
        } catch (err) {
            setError('Failed to delete cycles for month');
            console.error('Error deleting cycles for month:', err);
            throw err;
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
        predictCycleForMonth,
        deleteCyclesForMonth
    };
};

export const useAIRecommendations = () => {
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [healthConcerns, setHealthConcerns] = useState<boolean>(false);
    const [needsSTITesting, setNeedsSTITesting] = useState<boolean>(false);
    const [healthIssueDescription, setHealthIssueDescription] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);    const generateRecommendations = useCallback(async (
        cycles: CycleData[], 
        symptoms: { [key: string]: { symptom: string; period: string; flow: string } },
        forceRefresh: boolean = false
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
            
            const cycleData = cycles.map((cycle, index) => {
                const cycleSymptoms: string[] = [];
                
                if (cycle.cycleSymptomByDate) {
                    cycle.cycleSymptomByDate.forEach(symptomData => {
                        if (symptomData.symptom) {
                            if (symptomData.symptom === 'OTHER') {

                                const healthSymptoms = [
                                    'unusual discharge',
                                    'burning sensation',
                                    'pain during urination',
                                    'itching',
                                    'bleeding between periods',
                                    'pelvic pain',
                                    'fever',
                                    'strong odor',
                                    'unusual vaginal discharge with odor'
                                ];

                                healthSymptoms.forEach(symptom => {
                                    cycleSymptoms.push(symptom);
                                    recentSymptoms.push(symptom);
                                });
                            } else {
                                const symptomName = symptomData.symptom.toLowerCase().replace('_', ' ');
                                cycleSymptoms.push(symptomName);
                                recentSymptoms.push(symptomName);
                            }
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

                const sortedCycles = cycles
                    .filter(c => new Date(c.cycleStartDate) > cycleStartDate)
                    .sort((a, b) => new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime());
                
                const nextCycle = sortedCycles[0];
                const actualCycleLength = nextCycle 
                    ? Math.ceil((new Date(nextCycle.cycleStartDate).getTime() - cycleStartDate.getTime()) / (24 * 60 * 60 * 1000))
                    : cycle.cycleLength; // fallback to declared cycle length if no next cycle

                return {
                    cycleStartDate: cycle.cycleStartDate,
                    cycleLength: actualCycleLength,
                    periodDuration: cycle.periodDuration,
                    symptoms: cycleSymptoms
                };
            });

            const requestData: AIRecommendationRequest = {
                cycles: cycleData,
                recentSymptoms: Array.from(new Set(recentSymptoms))
            };

            console.log('Sending data to AI:', requestData);
            console.log('Cycle lengths being analyzed:', requestData.cycles.map(c => ({
                startDate: c.cycleStartDate,
                cycleLength: c.cycleLength,
                periodDuration: c.periodDuration
            })));
            console.log('Health-concerning symptoms found:', requestData.recentSymptoms.filter(s => 
                ['discharge', 'burning', 'urination', 'itching', 'bleeding between', 'pelvic pain', 'fever', 'odor'].some(concern => 
                    s.toLowerCase().includes(concern)
                )
            ));
            
            const hasExtremelyConcerningCycles = requestData.cycles.some(cycle => 
                cycle.cycleLength < 18 || cycle.cycleLength > 38 || cycle.periodDuration > 8
            );
            
            if (hasExtremelyConcerningCycles) {
                console.log('Detected extremely concerning cycle patterns - forcing health concern detection');
                requestData.recentSymptoms.push(
                    'unusual discharge', 'burning sensation', 'pain during urination', 
                    'itching', 'bleeding between periods', 'pelvic pain', 'fever'
                );
            }

            const aiResponse = await aiService.getRecommendations(requestData, forceRefresh);
            setRecommendations(aiResponse.recommendations);
            setHealthConcerns(aiResponse.healthConcerns);
            setNeedsSTITesting(aiResponse.needsSTITesting);
            setHealthIssueDescription(aiResponse.healthIssueDescription);
        } catch (err) {
            setError('Failed to generate recommendations');
            console.error('Error generating recommendations:', err);

            const recentSymptoms: string[] = [];
            
            Object.values(symptoms).forEach(symptomData => {
                if (symptomData.symptom && symptomData.symptom !== 'None') {
                    recentSymptoms.push(symptomData.symptom);
                }
            });
            
            const cycleData = cycles.map((cycle, index) => {

                const cycleStartDate = new Date(cycle.cycleStartDate);
                const sortedCycles = cycles
                    .filter(c => new Date(c.cycleStartDate) > cycleStartDate)
                    .sort((a, b) => new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime());
                
                const nextCycle = sortedCycles[0];
                const actualCycleLength = nextCycle 
                    ? Math.ceil((new Date(nextCycle.cycleStartDate).getTime() - cycleStartDate.getTime()) / (24 * 60 * 60 * 1000))
                    : cycle.cycleLength; // fallback to declared cycle length if no next cycle

                return {
                    cycleStartDate: cycle.cycleStartDate,
                    cycleLength: actualCycleLength,
                    periodDuration: cycle.periodDuration,
                    symptoms: []
                };
            });

            const fallbackRequestData: AIRecommendationRequest = {
                cycles: cycleData,
                recentSymptoms: Array.from(new Set(recentSymptoms))
            };
            
            const fallbackResponse = aiService.getFallbackResponse(fallbackRequestData);
            setRecommendations(fallbackResponse.recommendations);
            setHealthConcerns(fallbackResponse.healthConcerns);
            setNeedsSTITesting(fallbackResponse.needsSTITesting);
            setHealthIssueDescription(fallbackResponse.healthIssueDescription);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        recommendations,
        healthConcerns,
        needsSTITesting,
        healthIssueDescription,
        loading,
        error,
        generateRecommendations
    };
};

