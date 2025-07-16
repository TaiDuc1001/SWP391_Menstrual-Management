package swp391.com.backend.feature.testType.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateTestTypeRequest {
    
    @NotBlank(message = "Test type name is required")
    @Size(min = 2, max = 100, message = "Test type name must be between 2 and 100 characters")
    String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    String description;
    
    @Size(max = 100, message = "Normal range must not exceed 100 characters")
    String normalRange;
    
    @Size(max = 50, message = "Unit must not exceed 50 characters")  
    String unit;
}
