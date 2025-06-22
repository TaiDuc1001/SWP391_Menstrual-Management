package swp391.com.backend.feature.examination.exception;

import org.springframework.http.HttpStatus;
import swp391.com.backend.common.exception.BusinessException;

public class ExaminationConflictException extends BusinessException {
    public ExaminationConflictException(String message) {
        super(message, "Examination Conflict", HttpStatus.CONFLICT);
    }
}
