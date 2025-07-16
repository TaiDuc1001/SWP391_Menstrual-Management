package swp391.com.backend.feature.appointment.dto;

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
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCreateRequest {

    @NotNull(message = "Bác sĩ không được để trống")
    Long doctorId;

    @NotNull(message = "Khách hàng không được để trống")
    Long customerId;

    @NotBlank(message = "Ngày không được để trống")
    LocalDate date;

    @NotNull(message = "Khung giờ không được để trống")
    Slot slot;

    String customerNote;
}

