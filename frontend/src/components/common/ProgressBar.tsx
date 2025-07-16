import React from 'react';

interface ProgressBarProps {
    progress: number;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
            <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${clampedProgress}%` }}
            />
        </div>
    );
};

interface ProfileCompletionProps {
    profile: any;
    className?: string;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ profile, className = '' }) => {
    const calculateProgress = () => {
        if (!profile) return 0;
        
        const fields = [
            'name',
            'email', 
            'phone',
            'specialization',
            'qualification',
            'experienceYears',
            'appointmentPrice',
            'description'
        ];
        
        const arrayFields = [
            'education',
            'certifications',
            'languages'
        ];
        
        let completed = 0;
        const total = fields.length + arrayFields.length + 1; // +1 for avatar

        fields.forEach(field => {
            if (profile[field] && profile[field] !== '' && profile[field] !== 0) {
                completed++;
            }
        });

        arrayFields.forEach(field => {
            if (profile[field] && Array.isArray(profile[field]) && profile[field].length > 0) {
                completed++;
            }
        });

        if (profile.avatar) {
            completed++;
        }
        
        return Math.round((completed / total) * 100);
    };
    
    const progress = calculateProgress();
    
    return (
        <div className={`p-4 bg-white rounded-lg border ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Hoàn thiện hồ sơ</span>
                <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <ProgressBar progress={progress} />
            {progress < 100 && (
                <p className="text-xs text-gray-500 mt-2">
                    Hoàn thiện hồ sơ để tăng độ tin cậy với bệnh nhân
                </p>
            )}
        </div>
    );
};

