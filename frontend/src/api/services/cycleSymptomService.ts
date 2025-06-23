import api from '../axios';

export interface CycleSymptomRequest {
    date: string; // ISO date string
    symptom: string;
    period?: string;
    flow?: string;
}

export interface CycleSymptomResponse {
    cycleId: number;
    date: string;
    symptom: string;
}

export const cycleSymptomService = {
    async saveSymptom(data: CycleSymptomRequest): Promise<CycleSymptomResponse> {
        // Convert frontend symptom names to backend enum values
        const symptomMapping: { [key: string]: string } = {
            'Abdominal pain': 'CRAMPS',
            'Back pain': 'BACK_PAIN',
            'Headache': 'HEADACHE',
            'Nausea': 'NAUSEA',
            'None': 'OTHER'
        };

        const backendSymptom = symptomMapping[data.symptom] || 'OTHER';
        
        const requestData = {
            date: new Date(data.date).toISOString(),
            symptom: backendSymptom,
            period: data.period,
            flow: data.flow
        };

        const response = await api.post('/cycle-symptoms', requestData);
        return response.data;
    },

    async getAllSymptoms(): Promise<CycleSymptomResponse[]> {
        const response = await api.get('/cycle-symptoms');
        return response.data;
    },

    async getSymptomsByCycle(cycleId: number): Promise<CycleSymptomResponse[]> {
        const response = await api.get(`/cycle-symptoms/cycle/${cycleId}`);
        return response.data;
    },

    async deleteSymptomsByDate(date: string): Promise<void> {
        const isoDate = new Date(date).toISOString();
        await api.delete('/cycle-symptoms', {
            params: { date: isoDate }
        });
    },

    async deleteSpecificSymptom(cycleId: number, date: string, symptom: string): Promise<void> {
        const symptomMapping: { [key: string]: string } = {
            'Abdominal pain': 'CRAMPS',
            'Back pain': 'BACK_PAIN',
            'Headache': 'HEADACHE',
            'Nausea': 'NAUSEA',
            'None': 'OTHER'
        };

        const backendSymptom = symptomMapping[symptom] || 'OTHER';
        const isoDate = new Date(date).toISOString();
        
        await api.delete('/cycle-symptoms/specific', {
            params: { 
                cycleId,
                date: isoDate, 
                symptom: backendSymptom 
            }
        });
    }
};
