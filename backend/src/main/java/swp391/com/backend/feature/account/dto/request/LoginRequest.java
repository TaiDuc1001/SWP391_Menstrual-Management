package swp391.com.backend.feature.account.dto.request;

import lombok.Data;
import swp391.com.backend.feature.account.data.Role;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
