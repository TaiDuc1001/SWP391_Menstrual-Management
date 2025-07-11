package swp391.com.backend.feature.account.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminAccountUpdateRequest {
    private String email;
    private String password; //only update if provided
    private Boolean status;
    private String name;
    private String phoneNumber;
}
