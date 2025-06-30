import { doctorService, DoctorProfile } from './doctorService';
import { mockDoctorService } from './mockDoctorService';

class DoctorProfileService {
    private static instance: DoctorProfileService;
    private profile: DoctorProfile | null = null;
    private loading: boolean = false;
    private hasLoaded: boolean = false;
    private subscribers: Set<(profile: DoctorProfile | null, loading: boolean) => void> = new Set();

    static getInstance(): DoctorProfileService {
        if (!DoctorProfileService.instance) {
            DoctorProfileService.instance = new DoctorProfileService();
        }
        return DoctorProfileService.instance;
    }

    subscribe(callback: (profile: DoctorProfile | null, loading: boolean) => void) {
        this.subscribers.add(callback);
        callback(this.profile, this.loading);
        
        return () => {
            this.subscribers.delete(callback);
        };
    }

    private notify() {
        this.subscribers.forEach(callback => {
            callback(this.profile, this.loading);
        });
    }

    async loadProfile(useMockAPI: boolean = false): Promise<DoctorProfile | null> {
        if (this.hasLoaded && this.profile) {
            return this.profile;
        }

        if (this.loading) {
            return new Promise((resolve) => {
                const checkLoading = () => {
                    if (!this.loading) {
                        resolve(this.profile);
                    } else {
                        setTimeout(checkLoading, 50);
                    }
                };
                checkLoading();
            });
        }

        try {
            this.loading = true;
            this.notify();

            const service = useMockAPI ? mockDoctorService : doctorService;
            const response = await service.getDoctorProfile();
            
            this.profile = response.data;
            this.hasLoaded = true;
            
            return this.profile;
        } catch (error) {
            console.error('Error loading profile:', error);
            
            const fallbackProfile: DoctorProfile = {
                id: 1,
                name: "Dr. Sarah Johnson",
                specialization: "Gynecology",
                price: 500000,
                isProfileComplete: true
            };
            
            this.profile = fallbackProfile;
            this.hasLoaded = true;
            
            return this.profile;
        } finally {
            this.loading = false;
            this.notify();
        }
    }

    async updateProfile(profileData: Partial<DoctorProfile>, useMockAPI: boolean = false): Promise<DoctorProfile | null> {
        try {
            const service = useMockAPI ? mockDoctorService : doctorService;
            const response = await service.updateDoctorProfile(profileData);
            
            this.profile = response.data;
            this.notify();
            
            return this.profile;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    async checkProfileComplete(useMockAPI: boolean = false): Promise<{ isComplete: boolean; percentage: number }> {
        // If we have a cached profile, calculate completion from that
        if (this.profile) {
            const completedFields = [
                this.profile.name?.trim(),
                this.profile.specialization?.trim(),
                this.profile.price && this.profile.price > 0
            ].filter(Boolean).length;
            
            const percentage = Math.round((completedFields / 3) * 100);
            const isComplete = percentage === 100;
            
            return { isComplete, percentage };
        }

        // Otherwise, make API call
        try {
            const service = useMockAPI ? mockDoctorService : doctorService;
            const response = await service.checkProfileComplete();
            return response.data;
        } catch (error) {
            console.error('Error checking profile completion:', error);
            return { isComplete: false, percentage: 0 };
        }
    }

    clearCache() {
        this.profile = null;
        this.hasLoaded = false;
        this.loading = false;
        this.notify();
    }
}

export const doctorProfileService = DoctorProfileService.getInstance();
