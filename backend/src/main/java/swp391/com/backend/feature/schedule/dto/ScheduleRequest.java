package swp391.com.backend.feature.schedule.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleRequest {
    Long doctorId;
    LocalDate date;
}
