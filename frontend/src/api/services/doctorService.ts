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
        return api.get(`/doctors/by-id/${id}`);
    },

    createDoctor: (doctorData: {
        name: string;
        specialization: string;
        price: number;
        accountId: number;
    }) => {
        return api.post('/doctors', doctorData);
    },

    updateDoctor: (id: number, doctor: Partial<Doctor>) => {
        return api.put(`/doctors/by-id/${id}`, doctor);
    },

    deleteDoctor: (id: number) => {
        return api.delete(`/doctors/by-id/${id}`);
    },

    // Profile management APIs
    getDoctorProfile: (accountId?: number) => {
        if (!accountId) throw new Error('Missing account id for profile fetch');
        return api.get(`/doctors/profile/account/${accountId}`);
    },

    updateDoctorProfile: (profile: Partial<DoctorProfile>) => {
        // Yêu cầu truyền id trong profile (lấy từ context đăng nhập)
        if (!profile.id) throw new Error('Missing doctor id for profile update');
        return api.put(`/doctors/by-id/${profile.id}`, profile);
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
