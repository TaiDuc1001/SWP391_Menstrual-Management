package swp391.com.backend.common.util;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class AuthenticationUtil {
    
    /**
     * Extract customer ID from request header
     * This is a simplified authentication mechanism that relies on the frontend
     * to send the customer ID in the X-Customer-ID header
     * In a production environment, this should be replaced with proper JWT/session validation
     */
    public Long getCurrentCustomerId() {
        try {
            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = attr.getRequest();
            
            String customerIdHeader = request.getHeader("X-Customer-ID");
            if (customerIdHeader != null && !customerIdHeader.isEmpty()) {
                return Long.valueOf(customerIdHeader);
            }
            
            // Fallback for now - return a default customer ID
            // TODO: Replace with proper authentication mechanism
            return 3L;
            
        } catch (Exception e) {
            // If any error occurs, return default customer ID
            // TODO: In production, this should throw an authentication exception
            return 3L;
        }
    }

    /**
     * Extract doctor ID from request header
     * This is a simplified authentication mechanism that relies on the frontend
     * to send the doctor ID in the X-Doctor-ID header
     * In a production environment, this should be replaced with proper JWT/session validation
     */
    public Long getCurrentDoctorId() {
        try {
            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = attr.getRequest();
            
            String doctorIdHeader = request.getHeader("X-Doctor-ID");
            System.out.println("AuthenticationUtil.getCurrentDoctorId: X-Doctor-ID header = " + doctorIdHeader);
            
            if (doctorIdHeader != null && !doctorIdHeader.isEmpty()) {
                Long doctorId = Long.valueOf(doctorIdHeader);
                System.out.println("AuthenticationUtil.getCurrentDoctorId: Using doctor ID from header: " + doctorId);
                return doctorId;
            }
            
            // Try to get from user profile header as fallback
            String userIdHeader = request.getHeader("X-User-ID");
            System.out.println("AuthenticationUtil.getCurrentDoctorId: X-User-ID header = " + userIdHeader);
            
            if (userIdHeader != null && !userIdHeader.isEmpty()) {
                Long userId = Long.valueOf(userIdHeader);
                System.out.println("AuthenticationUtil.getCurrentDoctorId: Using user ID from header: " + userId);
                return userId;
            }
            
            // Fallback for now - return a default doctor ID
            System.out.println("AuthenticationUtil.getCurrentDoctorId: No headers found, using fallback ID: 1");
            return 1L;
            
        } catch (Exception e) {
            System.out.println("AuthenticationUtil.getCurrentDoctorId: Error occurred: " + e.getMessage());
            // If any error occurs, return default doctor ID
            return 1L;
        }
    }
}
