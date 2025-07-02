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
}
