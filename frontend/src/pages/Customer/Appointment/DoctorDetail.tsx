import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Doctor, doctorService} from '../../../api/services';
import {TitleBar} from '../../../components';

const DoctorDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await doctorService.getDoctorById(Number(id));
                setDoctor(response.data);
            } catch (err) {
                console.error('Error fetching doctor details:', err);
                setError('Failed to load doctor details');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);
    if (loading) {
        return (
            <div className="doctor-detail-loading">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading doctor details...</p>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="doctor-detail-error">
                <div className="doctor-detail-error-icon">⚠️</div>
                <h2 className="doctor-detail-error-title">Doctor not found</h2>
                <p className="doctor-detail-error-message">{error || 'Doctor not found'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="doctor-detail-error-btn"
                >
                    Go Back
                </button>
            </div>
        );
    }
    return (
        <div className="doctor-detail-container">
            <div className="doctor-detail-content">
                <TitleBar
                    text={doctor.name}
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                    onButtonClick={() => navigate(-1)}
                />
                <div className="doctor-detail-card">
                    <div className="doctor-detail-header">
                        <div className="doctor-detail-avatar">
                            {doctor.name.split(' ').slice(-1)[0][0]}
                        </div>
                        <div className="doctor-detail-info">
                            <div className="doctor-detail-name">{doctor.name}</div>
                            <div className="doctor-detail-field">Specialization: <span
                                className="doctor-detail-field-value">{doctor.specialization}</span></div>
                            <div className="doctor-detail-field">Experience: <span
                                className="doctor-detail-field-value">{doctor.experience} years</span></div>
                            <div className="doctor-detail-field">Price: <span
                                className="doctor-detail-field-value">{doctor.price}</span></div>
                            {(doctor.rating || doctor.reviews || doctor.appointments) && (
                                <div className="doctor-detail-stats">
                                    {doctor.rating && <span className="doctor-detail-rating">{doctor.rating} ★</span>}
                                    {doctor.reviews && <span>({doctor.reviews} reviews)</span>}
                                    {doctor.appointments &&
                                        <span className="ml-2 text-xs text-gray-400">({doctor.appointments} appointments given)</span>}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="doctor-detail-section">
                        <div className="doctor-detail-section-title">About</div>
                        <div className="doctor-detail-section-content">{doctor.bio || 'No bio available'}</div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorDetail;
