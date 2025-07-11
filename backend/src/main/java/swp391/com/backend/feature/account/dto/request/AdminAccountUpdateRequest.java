package swp391.com.backend.feature.account.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminAccountUpdateRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    private String password; //only update if provided
    private Boolean status;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Pattern(regexp = "^$|^0\\d{9}$", message = "Phone number must be 10 digits starting with 0.")
    private String phoneNumber;
}
