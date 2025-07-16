import React, { useEffect, useState } from 'react';
import '../../styles/pages/rating-history.css';
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
                setError('Failed to get doctor information');
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
            
            {}
            <div className="flex gap-3 mb-6 items-center bg-pink-50 rounded-xl px-4 py-3 shadow-sm">
                <div className="flex gap-2 items-center">
                    <span className="font-semibold text-pink-600">Filter by rating:</span>
                    <button
                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all duration-150 ${star === '' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-100'}`}
                        onClick={() => setStar('')}
                    >
                        All
                    </button>
                    {[5, 4, 3, 2, 1].map(s => (
                        <button
                            key={s}
                            className={`px-2 py-1 rounded-lg text-sm font-medium border flex items-center gap-1 transition-all duration-150 ${star === s ? 'bg-yellow-400 text-white border-yellow-400' : 'bg-white border-pink-200 text-yellow-600 hover:bg-yellow-100'}`}
                            onClick={() => setStar(s)}
                        >
                            {s} <span className="inline-block text-yellow-400 align-middle" style={{fontSize: '1.1em', marginLeft: 2}}>★</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="doctor-rating-history-table-wrapper">
                <table className="doctor-rating-history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Rating</th>
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
            {filteredRatings.length === 0 && <div className="doctor-rating-history-empty">No ratings found.</div>}
        </div>
    );
};

export default DoctorRatingHistory;

