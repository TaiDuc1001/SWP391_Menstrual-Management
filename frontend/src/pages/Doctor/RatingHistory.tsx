import React, { useEffect, useState } from 'react';
import '../../styles/pages/rating-history.css';
import RatingHistoryFilter from '../../components/feature/RatingHistoryFilter';
import { doctorRatingService } from '../../api/services/doctorRatingService';
import { doctorService } from '../../api/services/doctorService';


interface RatingHistoryItem {
    appointmentId: number;
    patientName: string;
    score: number;
    feedback: string;
    date: string;
}

const DoctorRatingHistory: React.FC = () => {
    const [ratings, setRatings] = useState<RatingHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [star, setStar] = useState<number | ''>('');

    useEffect(() => {
        doctorService.getDoctorProfile()
            .then(res => {
                setDoctorId(res.data.id);
            })
            .catch(() => {
                setError('Không lấy được thông tin bác sĩ');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!doctorId) return;
        doctorRatingService.getDoctorRatingHistory(doctorId)
            .then(res => {
                setRatings(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load rating history');
                setLoading(false);
            });
    }, [doctorId]);

    if (loading) return <div className="doctor-rating-history-container doctor-rating-history-empty">Loading rating history...</div>;
    if (error) return <div className="doctor-rating-history-container doctor-rating-history-empty text-red-500">{error}</div>;

    // Filter ratings by week, month, year
    const getFilteredRatings = () => {
        let filtered = ratings;
        if (star !== '') {
            filtered = filtered.filter(item => item.score === star);
        }
        return filtered;
    };

    const filteredRatings = getFilteredRatings();

    return (
        <div className="doctor-rating-history-container">
            <div className="doctor-rating-history-title">Rating History</div>
            <RatingHistoryFilter
                star={star}
                setStar={setStar}
            />
            <div className="doctor-rating-history-table-wrapper">
                <table className="doctor-rating-history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Score</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRatings.map((item) => (
                            <tr key={item.appointmentId}>
                                <td>{new Date(item.date).toLocaleDateString()}</td>
                                <td>{item.patientName}</td>
                                <td className="doctor-rating-history-score">
                                    {item.score}
                                    <svg className="doctor-rating-history-star" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                    </svg>
                                </td>
                                <td className="doctor-rating-history-feedback">{item.feedback}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredRatings.length === 0 && <div className="doctor-rating-history-empty">No ratings yet.</div>}
        </div>
    );
};

export default DoctorRatingHistory;
