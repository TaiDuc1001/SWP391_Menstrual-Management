package swp391.com.backend.feature.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorProfileDTO {
    private Long id;
    private String name;
    private String specialization;
    private Integer price;
    private Integer experience; // Số năm kinh nghiệm
    private Boolean isProfileComplete;
    private String degree; // Bằng cấp
    private String university; // Trường học
}

