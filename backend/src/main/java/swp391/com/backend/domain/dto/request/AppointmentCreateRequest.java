package swp391.com.backend.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCreateRequest {

    @NotBlank(message = "Ngày không được để trống")
    String date;

    @NotNull(message = "Khung giờ không được để trống")
    Integer slot;

    String note;

    String description;

}
