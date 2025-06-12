package swp391.com.backend.domain.dto.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.jpa.pojo.appointments.AppointmentStatus;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.roles.Doctor;
import swp391.com.backend.jpa.pojo.schedule.Slot;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentDTO {
    Long customerId;
    Long doctorId;
    String date;
    AppointmentStatus appointmentStatus;
    Slot slot;
    String customerNote;
}
