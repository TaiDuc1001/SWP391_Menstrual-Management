import React, { useEffect, useState } from 'react';
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

    if (loading) return <div className="p-8 text-center">Loading rating history...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Rating History</h1>
            <div className="bg-white rounded-xl shadow p-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Date</th>
                            <th className="py-2">Patient</th>
                            <th className="py-2">Score</th>
                            <th className="py-2">Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((item) => (
                            <tr key={item.appointmentId} className="border-b hover:bg-gray-50">
                                <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="py-2">{item.patientName}</td>
                                <td className="py-2 font-semibold text-yellow-600">{item.score}</td>
                                <td className="py-2">{item.feedback}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {ratings.length === 0 && <div className="text-center text-gray-500 py-8">No ratings yet.</div>}
            </div>
        </div>
    );
};

export default DoctorRatingHistory;
