package swp391.com.backend.feature.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private LocalDate date;
    private SlotResponse slot;
    private boolean hasAppointment;
}
