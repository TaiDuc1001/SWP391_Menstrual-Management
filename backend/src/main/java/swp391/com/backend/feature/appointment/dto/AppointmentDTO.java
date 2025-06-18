package swp391.com.backend.feature.appointment.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentDTO {
    Long customerId;
    Long doctorId;
    String date;
    AppointmentStatus appointmentStatus;
    String timeRange;
    String customerNote;
}
