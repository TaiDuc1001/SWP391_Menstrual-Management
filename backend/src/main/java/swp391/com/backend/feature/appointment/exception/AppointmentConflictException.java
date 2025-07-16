package swp391.com.backend.feature.appointment.exception;

import org.springframework.http.HttpStatus;
import swp391.com.backend.common.exception.BusinessException;

public class AppointmentConflictException extends BusinessException {
    public AppointmentConflictException(String message) {
        super(message, "Appointment Conflict", HttpStatus.CONFLICT);
    }
}

