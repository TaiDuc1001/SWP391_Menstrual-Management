package swp391.com.backend.feature.schedule.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class ScheduleDTO {
    private Long doctorId;
    List<Integer> scheduledSlots;
    List<Integer> bookedSlots;
    List<Integer> availableSlots;
}
