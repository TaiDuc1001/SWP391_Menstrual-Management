package swp391.com.backend.feature.account.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.account.data.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminAccountUpdateRequest {
    private String email;
    private String password; // Optional - only update if provided
    private Role role;
    private Boolean status;
    private String name;
    private String phoneNumber;
}
