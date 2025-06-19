package swp391.com.backend.feature.account.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.account.data.Role;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class AccountCreateRequest {

    @NotBlank(message = "Email không được để trống")
    String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    String password;

    @NotBlank(message = "Vai trò không được để trống")
    String role;
}
