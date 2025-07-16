import api from '../axios';

export const doctorRatingService = {
    getDoctorAverageRating: (doctorId: number) => {
        return api.get(`/appointments/doctor/${doctorId}/average-rating`);
    },
    getDoctorRatingHistory: (doctorId: number) => {
        return api.get(`/appointments/doctor/rating-history?doctorId=${doctorId}`);
    }
};

