package swp391.com.backend.common.util;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class AuthenticationUtil {
    
    
    public Long getCurrentCustomerId() {
        try {
            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = attr.getRequest();
            
            String customerIdHeader = request.getHeader("X-Customer-ID");
            if (customerIdHeader != null && !customerIdHeader.isEmpty()) {
                return Long.valueOf(customerIdHeader);
            }


            return 3L;
            
        } catch (Exception e) {


            return 3L;
        }
    }

    
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

            String userIdHeader = request.getHeader("X-User-ID");
            System.out.println("AuthenticationUtil.getCurrentDoctorId: X-User-ID header = " + userIdHeader);
            
            if (userIdHeader != null && !userIdHeader.isEmpty()) {
                Long userId = Long.valueOf(userIdHeader);
                System.out.println("AuthenticationUtil.getCurrentDoctorId: Using user ID from header: " + userId);
                return userId;
            }

            System.out.println("AuthenticationUtil.getCurrentDoctorId: No headers found, using fallback ID: 1");
            return 1L;
            
        } catch (Exception e) {
            System.out.println("AuthenticationUtil.getCurrentDoctorId: Error occurred: " + e.getMessage());

            return 1L;
        }
    }
}

