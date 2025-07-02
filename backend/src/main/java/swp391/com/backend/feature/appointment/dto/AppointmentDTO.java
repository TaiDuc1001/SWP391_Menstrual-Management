package swp391.com.backend.feature.appointment.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.hateoas.server.core.Relation;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Relation(collectionRelation = "appointments", itemRelation = "appointment")
public class AppointmentDTO {
    Long id;
    Long customerId;
    String customerName;
    Long doctorId;
    String doctorName;
    String date;
    AppointmentStatus appointmentStatus;
    String timeRange;
    String customerNote;
    String doctorNote;
    String url;
    String phoneNumber;
    Boolean doctorReady;
    Boolean customerReady;
}
