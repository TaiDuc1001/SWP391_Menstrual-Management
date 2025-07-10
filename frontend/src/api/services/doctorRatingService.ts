import api from '../axios';

export const doctorRatingService = {
    getDoctorAverageRating: (doctorId: number) => {
        return api.get(`/appointments/doctor/${doctorId}/average-rating`);
    }
};
