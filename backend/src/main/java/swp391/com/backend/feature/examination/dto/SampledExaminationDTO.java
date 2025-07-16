package swp391.com.backend.feature.examination.dto;

import lombok.Data;
import swp391.com.backend.feature.testType.dto.TestTypeDTO;
import swp391.com.backend.feature.examination.data.ExaminationStatus;

import java.time.LocalDate;
import java.util.List;

@Data
public class SampledExaminationDTO {
    private Long id;
    private List<TestTypeDTO> testTypes;
    private LocalDate date;
    private String timeRange;
    private String customerName;
    private String staffName;
    private ExaminationStatus examinationStatus;
}

