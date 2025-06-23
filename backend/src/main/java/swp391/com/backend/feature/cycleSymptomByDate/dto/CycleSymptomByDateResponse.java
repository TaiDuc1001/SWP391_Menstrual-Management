package swp391.com.backend.feature.cycleSymptomByDate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.cycleSymptomByDate.data.Symptom;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CycleSymptomByDateResponse {
    private Long cycleId;
    private LocalDateTime date;
    private Symptom symptom;
}
