export interface UserProfile {
    id: number;
    email: string;
    role: string;
    profile: {
        id: number;
        name: string;
        phoneNumber?: string;
        dateOfBirth?: string;
        address?: string;
        gender?: boolean;
        cccd?: string;
    } | null;
}

export const getCurrentUserProfile = (): UserProfile | null => {
    try {
        const userProfile = localStorage.getItem('userProfile');
        return userProfile ? JSON.parse(userProfile) : null;
    } catch (error) {
        console.error('Error parsing user profile:', error);
        return null;
    }
};

export const getCurrentStaffId = (): number | null => {
    const profile = getCurrentUserProfile();
    return profile?.profile?.id || null;
};

export const getCurrentUserName = (): string | null => {
    const profile = getCurrentUserProfile();
    return profile?.profile?.name || null;
};
