package swp391.com.backend.domain.dto.dto;

import lombok.Data;
import swp391.com.backend.jpa.pojo.examination.ExaminationStatus;
import swp391.com.backend.jpa.pojo.test.TestType;

import java.time.LocalDate;
import java.util.List;

@Data
public class SampledExaminationDTO {
    private Long id;
    private List<TestTypeDTO> testTypes;
    private LocalDate date;
    private String timeRange;
    private String customerName;
    private ExaminationStatus examinationStatus;
}
