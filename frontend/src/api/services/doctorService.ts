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

    deleteDoctor: (id: number) => {
        return api.delete(`/doctors/${id}`);
    },

    // Profile management APIs
    getDoctorProfile: () => {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const accountId = userProfile.id;
        console.log('getDoctorProfile - userProfile:', userProfile);
        console.log('getDoctorProfile - accountId:', accountId);
        if (!accountId) {
            console.error('No accountId found in userProfile:', userProfile);
            throw new Error('User account ID not found. Please login again.');
        }
        return api.get(`/doctors/profile?accountId=${accountId}`);
    },

    updateDoctorProfile: (profile: Partial<DoctorProfile>) => {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const accountId = userProfile.id;
        console.log('updateDoctorProfile - userProfile:', userProfile);
        console.log('updateDoctorProfile - accountId:', accountId);
        console.log('updateDoctorProfile - profile data:', profile);
        if (!accountId) {
            console.error('No accountId found in userProfile:', userProfile);
            throw new Error('User account ID not found. Please login again.');
        }
        return api.put(`/doctors/profile?accountId=${accountId}`, profile);
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
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const accountId = userProfile.id;
        console.log('checkProfileComplete - userProfile:', userProfile);
        console.log('checkProfileComplete - accountId:', accountId);
        if (!accountId) {
            console.error('No accountId found in userProfile:', userProfile);
            throw new Error('User account ID not found. Please login again.');
        }
        return api.get(`/doctors/profile/check-complete?accountId=${accountId}`);
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
