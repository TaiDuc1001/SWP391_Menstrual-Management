import api from '../axios';

export interface CycleData {
    id: number;
    cycleStartDate: string;
    cycleLength: number;
    periodDuration: number;
    ovulationDate: string;
    fertilityWindowStart: string;
    fertilityWindowEnd: string;
    cycleSymptomByDate?: CycleSymptom[];
}

export interface CycleSymptom {
    cycleId: number;
    date: string;
    symptom: string;
}

export interface CycleCreationRequest {
    startDate: string;
    cycleLength: number;
    periodDuration: number;
}

export const cycleService = {
    async getAllCycles(): Promise<CycleData[]> {
        const response = await api.get('/cycles');
        return response.data;
    },

    async getClosestCycle(): Promise<CycleData> {
        const response = await api.get('/cycles/closest');
        return response.data;
    },

    async createCycle(data: CycleCreationRequest): Promise<CycleData> {
        const response = await api.post('/cycles', data);
        return response.data;
    },

    async deleteCycle(id: number): Promise<void> {
        await api.delete(`/cycles/${id}`);
    },

    async deleteAllCycles(): Promise<void> {
        await api.delete('/cycles');
    },

    async getNextPrediction(): Promise<CycleData> {
        const response = await api.post('/cycles/next-prediction');
        return response.data;
    },

    async predictCycleForMonth(year: number, month: number): Promise<CycleData | null> {
        try {
            const response = await api.get(`/cycles/predict/${year}/${month}?customerId=3`);
            return response.data;
        } catch (error) {
            console.error('Error predicting cycle for month:', error);
            return null;
        }
    }
};

