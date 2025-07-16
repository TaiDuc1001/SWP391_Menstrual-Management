package swp391.com.backend.feature.account.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.account.data.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminAccountCreateRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private Role role;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Pattern(regexp = "^$|^0\\d{9}$", message = "Phone number must be 10 digits starting with 0.")
    private String phoneNumber;
    
    private Boolean status = true;
}

