package swp391.com.backend.feature.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRescheduleRequestDTO {
    private Long appointmentId;
    private String customerNote;
    private List<RescheduleOptionRequest> options;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RescheduleOptionRequest {
        private LocalDate date;
        private Slot slot;
    }
}
