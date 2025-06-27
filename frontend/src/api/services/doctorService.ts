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
    avatar?: string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    experienceYears: number;
    workingHours: {
        from: string;
        to: string;
    };
    appointmentPrice: number;
    rating: number;
    totalReviews: number;
    totalPatients: number;
    description: string;
    certifications: {
        id: number;
        name: string;
        issuedBy: string;
        year: number;
        file?: string;
    }[];
    education: {
        id: number;
        degree: string;
        institution: string;
        year: number;
    }[];
    languages: string[];
    achievements: string[];
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
