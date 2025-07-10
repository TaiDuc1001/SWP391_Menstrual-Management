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
                                <td className="py-2 font-semibold text-yellow-600">
                                    {item.score}
                                    <svg className="inline-block w-4 h-4 ml-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                    </svg>
                                </td>
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
