package swp391.com.backend.feature.appointment.dto;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;


import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SimpleAppointmentDTO {
    Long id;
    String customerName;
    String doctorName;
    LocalDate date;
    String timeRange;
    AppointmentStatus appointmentStatus;
    String phoneNumber;
    String customerNote;
    String url;
}

