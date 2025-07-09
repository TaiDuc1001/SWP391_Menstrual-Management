package swp391.com.backend.feature.account.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.account.data.Role;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminAccountCreateRequest {
    private String email;
    private String password;
    private Role role;
    private String name;
    private String phoneNumber;
    private Boolean status = true;
    
    // Doctor specific fields
    private String specialization;
    private BigDecimal price;
}
