package swp391.com.backend.feature.examination.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExaminationCreateRequest {
    @NotBlank(message = "Ngày không được để trống")
    LocalDate date;

    @NotNull(message = "Khung giờ không được để trống")
    Slot slot;
}

