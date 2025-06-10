package swp391.com.backend.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler
    public String handleException(Exception e) {
        // Log the exception (optional)
        System.err.println("An error occurred: " + e.getMessage());

        // Return a generic error message
        return "An unexpected error occurred. Please try again later.";
    }
}
