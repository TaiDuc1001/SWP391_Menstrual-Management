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
public class RescheduleRequestDTO {
    private Long id;
    private Long appointmentId;
    private Long customerId;
    private Long doctorId;
    private String customerNote;
    private RescheduleStatus status;
    private List<RescheduleOptionDTO> options;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RescheduleOptionDTO {
        private Long id;
        private LocalDate date;
        private Slot slot;
        private String timeRange;
        private Boolean isSelected;
    }
}
