import { DoctorProfile } from './doctorService';

const STORAGE_KEY = 'mock_doctor_profile';

// Get profile from localStorage or use default
const getStoredProfile = (): DoctorProfile => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error parsing stored profile:', error);
        }
    }
    
    // Default mock data
    return {
        id: 1,
        name: "",
        avatar: "",
        email: "",
        phone: "",
        specialization: "",
        qualification: "",
        experienceYears: 0,
        workingHours: {
            from: "08:00",
            to: "17:00"
        },
        appointmentPrice: 0,
        rating: 0,
        totalReviews: 0,
        totalPatients: 0,
        description: "",
        certifications: [],
        education: [],
        languages: ["Tiếng Việt"],
        achievements: [],
        isProfileComplete: false
    };
};

// Save profile to localStorage
const saveProfile = (profile: DoctorProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

// Check if profile is complete
const checkProfileCompletion = (profile: DoctorProfile): boolean => {
    const requiredFields = [
        'name', 'email', 'phone', 'specialization', 
        'qualification', 'description'
    ];
    
    const hasRequiredFields = requiredFields.every(field => 
        profile[field as keyof DoctorProfile] && 
        profile[field as keyof DoctorProfile] !== ''
    );
    
    const hasEducation = profile.education && profile.education.length > 0;
    const hasExperience = profile.experienceYears > 0;
    const hasPrice = profile.appointmentPrice > 0;
    
    return hasRequiredFields && hasEducation && hasExperience && hasPrice;
};

// Mock service for testing without backend
export const mockDoctorService = {
    getDoctorProfile: () => {
        const profile = getStoredProfile();
        console.log('Getting stored profile:', profile);
        return Promise.resolve({
            data: profile
        });
    },

    updateDoctorProfile: (updateData: Partial<DoctorProfile>) => {
        console.log('Updating profile with:', updateData);
        
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                const currentProfile = getStoredProfile();
                const updatedProfile = { 
                    ...currentProfile, 
                    ...updateData,
                    id: currentProfile.id // Preserve ID
                };
                
                // Check if profile is complete after update
                updatedProfile.isProfileComplete = checkProfileCompletion(updatedProfile);
                
                // Save to localStorage
                saveProfile(updatedProfile);
                
                console.log('Profile saved:', updatedProfile);
                
                resolve({
                    data: updatedProfile
                });
            }, 1000);
        });
    },

    uploadAvatar: (file: File) => {
        console.log('Uploading avatar:', file.name);
        return Promise.resolve({
            data: {
                url: URL.createObjectURL(file) // Create temporary URL for preview
            }
        });
    },

    checkProfileComplete: () => {
        const profile = getStoredProfile();
        const isComplete = checkProfileCompletion(profile);
        console.log('Profile complete check:', isComplete);
        
        return Promise.resolve({
            data: {
                isComplete
            }
        });
    },

    getSpecializations: () => {
        return Promise.resolve({
            data: [
                'Sản phụ khoa',
                'Nội tiết - Tuyến vú',
                'Nội khoa tổng quát',
                'Tâm lý học',
                'Dinh dưỡng',
                'Y học gia đình',
                'Da liễu',
                'Tim mạch',
                'Tiêu hóa',
                'Hô hấp'
            ]
        });
    },

    // Utility methods for testing
    clearProfile: () => {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Profile cleared from localStorage');
    },

    setCompleteProfile: () => {
        const completeProfile: DoctorProfile = {
            id: 1,
            name: "TS.BS Nguyễn Thị Hoa",
            avatar: "",
            email: "hoa.nguyen@example.com",
            phone: "0912345678",
            specialization: "Sản phụ khoa",
            qualification: "Tiến sĩ Y khoa",
            experienceYears: 15,
            workingHours: {
                from: "08:00",
                to: "17:00"
            },
            appointmentPrice: 500000,
            rating: 4.8,
            totalReviews: 256,
            totalPatients: 1250,
            description: "Chuyên gia với hơn 15 năm kinh nghiệm trong lĩnh vực sản phụ khoa. Chuyên điều trị các bệnh lý phụ khoa, thai sản và vô sinh hiếm muộn.",
            certifications: [
                {
                    id: 1,
                    name: "Chứng chỉ hành nghề khám chữa bệnh",
                    issuedBy: "Bộ Y tế",
                    year: 2010
                }
            ],
            education: [
                {
                    id: 1,
                    degree: "Tiến sĩ Y khoa",
                    institution: "Đại học Y Hà Nội",
                    year: 2015
                }
            ],
            languages: ["Tiếng Việt", "Tiếng Anh"],
            achievements: [
                "Giải thưởng Bác sĩ xuất sắc năm 2020"
            ],
            isProfileComplete: true
        };
        
        saveProfile(completeProfile);
        console.log('Complete profile set');
    }
};
