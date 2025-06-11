package swp391.com.backend.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.jpa.pojo.test.Package;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCreateRequest {

    @NotNull(message = "Gói xét nghiệm không được để trống")
    Package aPackage;

    @NotBlank(message = "Ngày không được để trống")
    String date;

    @NotNull(message = "Khung giờ không được để trống")
    Integer slot;

    String note;

}
