import api from '../axios';

export interface Doctor {
    id: number;
    name: string;
    email: string;
    specialization: string;
    experience: number;
    price: number;
    phoneNumber: string;
    bio?: string;
    avatar?: string;
    rating?: number;
    reviews?: number;
    appointments?: number;
}

export interface DoctorProfile {
    id: number;
    name: string;
    specialization: string;
    price: number;
    experience: number;
    isProfileComplete: boolean;
}

export interface DoctorFilters {
    specialization?: string;
    experience?: number;
    priceRange?: [number, number];
}

export const doctorService = {
    getAllDoctors: (filters?: DoctorFilters) => {
        const params = new URLSearchParams();
        if (filters?.specialization) params.append('specialization', filters.specialization);
        if (filters?.experience) params.append('experience', filters.experience.toString());
        if (filters?.priceRange) {
            params.append('minPrice', filters.priceRange[0].toString());
            params.append('maxPrice', filters.priceRange[1].toString());
        }

        return api.get(`/doctors?${params.toString()}`);
    },

    getDoctorById: (id: number) => {
        return api.get(`/doctors/${id}`);
    },

    createDoctor: (doctor: Omit<Doctor, 'id'>) => {
        return api.post('/doctors', doctor);
    },

    updateDoctor: (id: number, doctor: Partial<Doctor>) => {
        return api.put(`/doctors/${id}`, doctor);
    },

    // Admin update doctor profile
    adminUpdateDoctorProfile: (id: number, profileData: { name: string; specialization: string; price: number; experience: number }) => {
        return api.put(`/doctors/${id}`, profileData);
    },

    // Admin create doctor profile
    adminCreateDoctorProfile: (userId: number, profileData: { name: string; specialization: string; price: number; experience: number }) => {
        return api.post(`/doctors/admin/${userId}`, profileData);
    },

    deleteDoctor: (id: number) => {
        return api.delete(`/doctors/${id}`);
    },

    // Profile management APIs
    getDoctorProfile: () => {
        return api.get('/doctors/profile');
    },

    updateDoctorProfile: (profile: Partial<DoctorProfile>) => {
        return api.put('/doctors/profile', profile);
    },

    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return api.post('/doctors/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    checkProfileComplete: () => {
        return api.get('/doctors/profile/check-complete');
    },

    // Specialization options
    getSpecializations: () => {
        return api.get('/doctors/specializations');
    },

    // Authentication token management
    setAuthToken: (token: string) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('doctor_token', token);
    },

    removeAuthToken: () => {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('doctor_token');
        // Clear doctor profile cache khi remove token
        const { doctorProfileService } = require('./doctorProfileService');
        if (doctorProfileService) {
            doctorProfileService.clearCache();
        }
    },

    // Initialize auth from localStorage
    initAuth: () => {
        const token = localStorage.getItem('doctor_token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return !!token;
    }
};
