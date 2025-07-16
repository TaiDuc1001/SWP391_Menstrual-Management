package swp391.com.backend.feature.cycle.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class CycleCreationRequest {
    @NotNull(message = "Ngày bắt đầu không được để trống")
    LocalDate startDate;

    @NotNull(message = "Số ngày hành kinh không được để trống")
    Integer periodDuration;

    @NotNull(message = "Thời gian chu kỳ không được để trống")
    Integer cycleLength;
}

