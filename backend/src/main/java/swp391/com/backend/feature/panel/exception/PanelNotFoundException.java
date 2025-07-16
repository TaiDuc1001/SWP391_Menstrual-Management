package swp391.com.backend.feature.panel.exception;

import org.springframework.http.HttpStatus;
import swp391.com.backend.common.exception.BusinessException;

public class PanelNotFoundException extends BusinessException {
    public PanelNotFoundException(String message) {
        super(message, "Panel Not Found", HttpStatus.NOT_FOUND);
    }
    
    public PanelNotFoundException(Long id) {
        super("Panel not found with id: " + id, "Panel Not Found", HttpStatus.NOT_FOUND);
    }
}

