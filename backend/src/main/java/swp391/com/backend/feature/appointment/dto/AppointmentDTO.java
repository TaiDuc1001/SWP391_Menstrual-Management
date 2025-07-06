package swp391.com.backend.feature.appointment.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.hateoas.server.core.Relation;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Relation(collectionRelation = "appointments", itemRelation = "appointment")
public class AppointmentDTO {
    Long id;
    Long customerId;
    String customerName;
    Long doctorId;
    String doctorName;
    LocalDate date;
    AppointmentStatus appointmentStatus;
    Slot slot;
    String timeRange;
    String customerNote;
    String doctorNote;
    String url;
    String customerPhoneNumber;
    Boolean doctorReady;
    Boolean customerReady;
}
