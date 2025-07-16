package swp391.com.backend.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessException extends RuntimeException {
    private final HttpStatus status;
    private final String title;

    public BusinessException(String message, String title, HttpStatus status) {
        super(message);
        this.title = title;
        this.status = status;
    }
}
