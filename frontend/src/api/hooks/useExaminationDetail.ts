import { useState, useEffect } from 'react';
import { examinationService, ExaminationDetail } from '../services/examinationService';

export const useExaminationDetail = (id: string | undefined) => {
    const [examination, setExamination] = useState<ExaminationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExaminationDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const data = await examinationService.getExaminationDetail(id);
                setExamination(data);
            } catch (err) {
                console.error('Error fetching examination details:', err);
                setError('Failed to load examination details');
            } finally {
                setLoading(false);
            }
        };

        fetchExaminationDetail();
    }, [id]);
    const refetch = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const data = await examinationService.getExaminationDetail(id);
            setExamination(data);
        } catch (err) {
            console.error('Error fetching examination details:', err);
            setError('Failed to load examination details');
        } finally {
            setLoading(false);
        }
    };

    return {
        examination,
        loading,
        error,
        refetch
    };
};
