package swp391.com.backend.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.jpa.pojo.schedule.Slot;
import swp391.com.backend.jpa.pojo.test.Panel;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCreateRequest {

    @NotNull(message = "Gói xét nghiệm không được để trống")
    Panel aPanel;

    @NotBlank(message = "Ngày không được để trống")
    LocalDate date;

    @NotNull(message = "Khung giờ không được để trống")
    Slot slot;

    String note;

}
