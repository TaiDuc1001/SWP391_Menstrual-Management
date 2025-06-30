package swp391.com.backend.feature.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorProfileCompleteDTO {
    private Boolean isComplete;
    private Integer percentage;
}
