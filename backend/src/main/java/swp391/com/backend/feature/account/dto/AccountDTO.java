package swp391.com.backend.feature.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.account.data.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    private Integer id;
    private String email;
    private Role role;
    private ActorDTO profile;
}
