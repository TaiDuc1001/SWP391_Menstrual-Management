import React, { useState } from 'react';
import { Button } from '../../index';
import api from '../../../api/axios';

interface RatingModalProps {
    appointmentId: number;
    currentScore?: number;
    currentFeedback?: string;
    onClose: () => void;
    onSuccess: (score: number, feedback: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
    appointmentId,
    currentScore = 0,
    currentFeedback = '',
    onClose,
    onSuccess
}) => {
    const [score, setScore] = useState<number>(currentScore);
    const [feedback, setFeedback] = useState<string>(currentFeedback);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (score === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.put(`/appointments/rate/${appointmentId}`, {
                score,
                feedback: feedback.trim()
            });
            
            onSuccess(score, feedback);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit rating');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
                className={`text-2xl ${
                    star <= score ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
            >
                ★
            </button>
        ));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Rate Doctor</h2>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="rating-section">
                        <label className="rating-label">Rating:</label>
                        <div className="star-rating">
                            {renderStars()}
                        </div>
                        {score > 0 && (
                            <span className="rating-text">
                                {score === 1 && 'Poor'}
                                {score === 2 && 'Fair'}
                                {score === 3 && 'Good'}
                                {score === 4 && 'Very Good'}
                                {score === 5 && 'Excellent'}
                            </span>
                        )}
                    </div>

                    <div className="feedback-section">
                        <label className="feedback-label">
                            Feedback (Optional):
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share your experience with the doctor..."
                            rows={4}
                            className="feedback-textarea"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || score === 0}
                        >
                            {loading ? 'Submitting...' : 'Submit Rating'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
