package swp391.com.backend.feature.account.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class AccountUpdateRequest {
    String email;
    String password;
    Boolean status;
}
