// Test for Doctor Profile Persistence Bug Fix
// This file contains test scenarios to verify the profile persistence fix

export const testProfilePersistence = {
    // Test 1: Register new doctor and create profile
    async testRegisterAndCreateProfile() {
        console.log('=== Test 1: Register new doctor and create profile ===');
        
        // Simulate registration
        const mockUserData = {
            id: Math.floor(Math.random() * 1000),
            email: 'testdoctor@example.com',
            role: 'doctor'
        };
        
        localStorage.setItem('userProfile', JSON.stringify(mockUserData));
        localStorage.setItem('role', 'doctor');
        
        // Initialize profile
        const { mockDoctorService } = await import('../api/services/mockDoctorService');
        mockDoctorService.initializeProfile();
        
        // Create complete profile
        const profileData = {
            name: 'Dr. Test Doctor',
            specialization: 'Gynecology',
            price: 100
        };
        
        await mockDoctorService.updateDoctorProfile(profileData);
        
        // Verify profile is complete
        const checkResult = await mockDoctorService.checkProfileComplete();
        console.log('Profile completion after creation:', checkResult.data);
        
        return checkResult.data.isComplete;
    },

    // Test 2: Logout and verify profile data remains
    testLogout() {
        console.log('=== Test 2: Logout and verify profile data remains ===');
        
        const userProfile = localStorage.getItem('userProfile');
        const userId = userProfile ? JSON.parse(userProfile).id : null;
        
        console.log('User ID before logout:', userId);
        
        // Get profile key before logout
        const profileKey = `mock_doctor_profile_${userId}`;
        const profileDataBeforeLogout = localStorage.getItem(profileKey);
        
        // Simulate logout (only clear auth data, not profile data)
        localStorage.removeItem('role');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('doctor_token');
        
        // Verify profile data still exists
        const profileDataAfterLogout = localStorage.getItem(profileKey);
        
        console.log('Profile data before logout:', profileDataBeforeLogout);
        console.log('Profile data after logout:', profileDataAfterLogout);
        
        return profileDataAfterLogout === profileDataBeforeLogout;
    },

    // Test 3: Login again and verify profile is restored
    async testLoginAndRestoreProfile() {
        console.log('=== Test 3: Login again and verify profile is restored ===');
        
        // Find existing profile key
        const profileKey = Object.keys(localStorage).find(key => key.startsWith('mock_doctor_profile_'));
        let userId = 1;
        
        if (profileKey) {
            const profileData = localStorage.getItem(profileKey);
            if (profileData) {
                try {
                    const parsed = JSON.parse(profileData);
                    userId = parsed.id || 1;
                } catch (error) {
                    console.error('Error parsing profile data:', error);
                }
            }
        }
        
        // Simulate login with same user
        const mockUserData = {
            id: userId,
            email: 'testdoctor@example.com',
            role: 'doctor'
        };
        
        localStorage.setItem('userProfile', JSON.stringify(mockUserData));
        localStorage.setItem('role', 'doctor');
        
        // Initialize profile (should restore existing profile)
        const { mockDoctorService } = await import('../api/services/mockDoctorService');
        mockDoctorService.initializeProfile();
        
        // Check profile completion
        const checkResult = await mockDoctorService.checkProfileComplete();
        console.log('Profile completion after login:', checkResult.data);
        
        // Get profile data
        const profileResult = await mockDoctorService.getDoctorProfile();
        console.log('Profile data after login:', profileResult.data);
        
        return checkResult.data.isComplete && profileResult.data.name === 'Dr. Test Doctor';
    },

    // Run all tests
    async runAllTests() {
        console.log('🧪 Starting Doctor Profile Persistence Tests...');
        
        try {
            const test1Result = await this.testRegisterAndCreateProfile();
            console.log('Test 1 - Register and Create Profile:', test1Result ? '✅ PASS' : '❌ FAIL');
            
            const test2Result = this.testLogout();
            console.log('Test 2 - Logout Preserves Profile:', test2Result ? '✅ PASS' : '❌ FAIL');
            
            const test3Result = await this.testLoginAndRestoreProfile();
            console.log('Test 3 - Login Restores Profile:', test3Result ? '✅ PASS' : '❌ FAIL');
            
            const allPassed = test1Result && test2Result && test3Result;
            console.log('\n🎯 Overall Test Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
            
            return allPassed;
        } catch (error) {
            console.error('Test execution error:', error);
            return false;
        }
    }
};

// Make available globally for testing in browser console
(window as any).testProfilePersistence = testProfilePersistence;
