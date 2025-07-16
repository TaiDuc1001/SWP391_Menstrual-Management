package swp391.com.backend.feature.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateScheduleRequest {
    private LocalDate date;
    private Slot slot;
}

