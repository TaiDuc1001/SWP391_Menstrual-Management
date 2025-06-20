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
  }
};
