import api from '../axios';

export interface SymptomNote {
    cycleId: number;
    date: string; // ISO format: 'YYYY-MM-DD'
    symptom: string; // Enum value, e.g. 'HEADACHE'
}

export const cycleSymptomService = {
    // Save or update a symptom note for a specific day
    saveSymptomNote: (note: SymptomNote) => {
        return api.post('/cycle-symptoms', note);
    },

    // Get all symptom notes for a cycle (or by date range if needed)
    getSymptomsByCycle: (cycleId: number) => {
        return api.get(`/cycle-symptoms?cycleId=${cycleId}`);
    },

    // Optionally: get symptoms for a specific date
    getSymptomsByDate: (cycleId: number, date: string) => {
        return api.get(`/cycle-symptoms/${cycleId}/${date}`);
    },

    // Delete symptom for a specific day
    deleteSymptomNote: (cycleId: number, date: string) => {
        return api.delete(`/cycle-symptoms/${cycleId}/${date}`);
    }
};
