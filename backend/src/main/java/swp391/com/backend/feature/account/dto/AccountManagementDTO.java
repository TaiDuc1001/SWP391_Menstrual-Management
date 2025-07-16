package swp391.com.backend.feature.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.account.data.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountManagementDTO {
    private Long id;
    private String email;
    private Role role;
    private Boolean status;
    private String name;
    private String phoneNumber;
    private String avatar;

    public AccountManagementDTO(Long id, String email, Role role, Boolean status) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.status = status;
    }
}

