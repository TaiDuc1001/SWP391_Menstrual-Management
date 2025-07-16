package swp391.com.backend.feature.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorScheduleResponse {
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private List<ScheduleResponse> schedules;
}

