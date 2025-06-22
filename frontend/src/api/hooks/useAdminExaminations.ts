import { useState, useEffect } from 'react';
import { examinationService, ExaminationDetail } from '../services/examinationService';

interface Examination {
    id: number;
    date: string;
    timeRange: string;
    examinationStatus: string;
    panelName: string;
    customerName: string;
}

export const useAdminExaminations = () => {
    const [examinations, setExaminations] = useState<Examination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);    const fetchExaminations = async () => {
        try {
            setLoading(true);
            const examinations = await examinationService.getAllExaminations();
            const mappedExaminations = examinations.map((exam: ExaminationDetail) => ({
                id: exam.id,
                date: exam.date,
                timeRange: exam.timeRange,
                examinationStatus: exam.examinationStatus,
                panelName: exam.panelName || '',
                customerName: exam.customerName
            }));
            setExaminations(mappedExaminations);
            setError(null);
        } catch (err) {
            setError('Failed to load examinations');
            console.error('Error fetching examinations:', err);
        } finally {
            setLoading(false);
        }
    };

    const approveExamination = async (id: number) => {
        try {
            await examinationService.approveExamination(id);
            await fetchExaminations();
            return { success: true, message: 'Examination approved successfully' };
        } catch (err) {
            console.error('Error approving examination:', err);
            return { success: false, message: 'Failed to approve examination' };
        }
    };

    const cancelExamination = async (id: number) => {
        try {
            await examinationService.cancelExamination(id);
            await fetchExaminations();
            return { success: true, message: 'Examination cancelled successfully' };
        } catch (err) {
            console.error('Error cancelling examination:', err);
            return { success: false, message: 'Failed to cancel examination' };
        }
    };

    const getExaminationDetail = async (id: number): Promise<ExaminationDetail | null> => {
        try {
            return await examinationService.getExaminedDetail(id);
        } catch (err) {
            console.error('Error fetching examination detail:', err);
            return null;
        }
    };

    useEffect(() => {
        fetchExaminations();
    }, []);

    return {
        examinations,
        loading,
        error,
        refetch: fetchExaminations,
        approveExamination,
        cancelExamination,
        getExaminationDetail
    };
};
