import { DoctorProfile } from './doctorService';

let cachedProfile: DoctorProfile | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

const getCurrentUserId = (): string => {
    try {
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
            const parsed = JSON.parse(userProfile);
            const userId = parsed.id?.toString();
            if (userId && userId !== 'undefined' && userId !== 'null') {
                return userId;
            }
        }
    } catch (error) {
        console.error('Error getting user ID:', error);
    }
    
    const role = localStorage.getItem('role');
    if (role) {
        const tempId = `temp_${Date.now()}`;
        return tempId;
    }
    
    return 'default';
};

const getStorageKey = (): string => {
    const userId = getCurrentUserId();
    return `mock_doctor_profile_${userId}`;
};

const getStoredProfile = (): DoctorProfile => {
    const userId = getCurrentUserId();
    const storageKey = getStorageKey();
    
    const stored = localStorage.getItem(storageKey);
    if (stored) {
        try {
            const profile = JSON.parse(stored);
            return profile;
        } catch (error) {
            console.error('Error parsing stored profile:', error);
        }
    }
    
    const defaultProfile = {
        id: parseInt(userId) || Math.floor(Math.random() * 1000),
        name: "",
        specialization: "",
        price: 0,
        isProfileComplete: false
    };
    
    return defaultProfile;
};

const saveProfile = (profile: DoctorProfile) => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(profile));
};

// Check if profile is complete
const checkProfileCompletion = (profile: DoctorProfile): boolean => {
    const requiredFields = ['name', 'specialization'];
    
    const hasRequiredFields = requiredFields.every(field => 
        profile[field as keyof DoctorProfile] && 
        String(profile[field as keyof DoctorProfile]).trim() !== ''
    );
    
    const hasPrice = profile.price > 0;
    
    return hasRequiredFields && hasPrice;
};

// Calculate profile completion percentage
const calculateCompletionPercentage = (profile: DoctorProfile): number => {
    let completed = 0;
    let total = 3; // name, specialization, price
    
    if (profile.name && profile.name.trim() !== '') completed++;
    if (profile.specialization && profile.specialization.trim() !== '') completed++;
    if (profile.price > 0) completed++;
    
    return Math.round((completed / total) * 100);
};

export const mockDoctorService = {
    // Initialize profile for current user (should be called after login)
    initializeProfile: () => {
        const userId = getCurrentUserId();
        const storageKey = getStorageKey();
        console.log(`Initializing profile for user ${userId} with key ${storageKey}`);
        
        // Check if profile exists for this user
        const existing = localStorage.getItem(storageKey);
        if (!existing) {
            // Create default profile for new user
            const defaultProfile = {
                id: parseInt(userId) || Math.floor(Math.random() * 1000),
                name: "",
                specialization: "",
                price: 0,
                isProfileComplete: false
            };
            saveProfile(defaultProfile);
            console.log(`Created default profile for new user ${userId}`);
        } else {
            // Profile exists, ensure it's properly loaded and completion status is updated
            try {
                const profile = JSON.parse(existing);
                profile.isProfileComplete = checkProfileCompletion(profile);
                saveProfile(profile);
                console.log(`Restored existing profile for user ${userId}:`, profile);
            } catch (error) {
                console.error('Error restoring existing profile:', error);
                // If there's an error parsing, create a new default profile
                const defaultProfile = {
                    id: parseInt(userId) || Math.floor(Math.random() * 1000),
                    name: "",
                    specialization: "",
                    price: 0,
                    isProfileComplete: false
                };
                saveProfile(defaultProfile);
                console.log(`Created new default profile after error for user ${userId}`);
            }
        }
    },

    // Get doctor profile
    getDoctorProfile: async (): Promise<{ data: DoctorProfile }> => {
        return new Promise((resolve) => {
            const now = Date.now();
            if (cachedProfile && (now - cacheTimestamp) < CACHE_DURATION) {
                console.log('Returning cached profile - no API call made');
                resolve({ data: cachedProfile });
                return;
            }
            
            console.log('Making new API call to get doctor profile');
            setTimeout(() => {
                let profile = getStoredProfile();
                
                profile.isProfileComplete = checkProfileCompletion(profile);
                saveProfile(profile);
                
                cachedProfile = profile;
                cacheTimestamp = now;
                
                console.log(`API call completed - profile retrieved and cached`);
                resolve({ data: profile });
            }, 200);
        });
    },

    // Update doctor profile
    updateDoctorProfile: async (profileData: Partial<DoctorProfile>): Promise<{ data: DoctorProfile }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const currentProfile = getStoredProfile();
                const updatedProfile = {
                    ...currentProfile,
                    ...profileData,
                    id: currentProfile.id // Preserve the original ID
                };
                
                updatedProfile.isProfileComplete = checkProfileCompletion(updatedProfile);
                saveProfile(updatedProfile);
                
                // Clear cache since profile was updated
                cachedProfile = null;
                cacheTimestamp = 0;
                
                resolve({ data: updatedProfile });
            }, 800);
        });
    },

    // Upload avatar (simplified - just returns a mock URL)
    uploadAvatar: async (file: File): Promise<{ data: { url: string } }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Create a mock URL for the uploaded file
                const mockUrl = URL.createObjectURL(file);
                resolve({ data: { url: mockUrl } });
            }, 1000);
        });
    },

    // Check if profile is complete
    checkProfileComplete: async (): Promise<{ data: { isComplete: boolean; percentage: number } }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let profile = getStoredProfile();
                
                // Ensure profile completion status is always up-to-date
                const isComplete = checkProfileCompletion(profile);
                const percentage = calculateCompletionPercentage(profile);
                
                // Update the profile with current completion status
                profile.isProfileComplete = isComplete;
                saveProfile(profile);
                
                console.log(`Profile completion check for user ${getCurrentUserId()}: ${isComplete} (${percentage}%)`);
                
                resolve({ 
                    data: { 
                        isComplete,
                        percentage
                    } 
                });
            }, 300);
        });
    },

    // Get available specializations
    getSpecializations: async (): Promise<{ data: string[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    data: [
                        'Gynecology',
                        'Urology', 
                        'Infectious Diseases',
                        'Sexual Health',
                        'Reproductive Health',
                        'Women\'s Health'
                    ] 
                });
            }, 300);
        });
    },

    // Clear profile (for testing)
    clearProfile: () => {
        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
        console.log(`Profile cleared from localStorage for user ${getCurrentUserId()}`);
    },

    // Logout utility - clear current user's profile data
    logout: () => {
        const userId = getCurrentUserId();
        console.log(`Logging out user ${userId}`);
        // Note: We don't clear the profile on logout to preserve data between sessions
        // Profile data should persist until user explicitly deletes account or profile
    },

    // Get a complete mock profile (for testing)
    getCompleteMockProfile: () => {
        const userId = getCurrentUserId();
        return {
            id: parseInt(userId) || 1,
            name: "Dr. Sarah Johnson",
            specialization: "Gynecology",
            price: 500000,
            isProfileComplete: true
        };
    }
};
