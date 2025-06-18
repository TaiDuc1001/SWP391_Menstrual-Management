package swp391.com.backend.feature.examination.dto;

import lombok.Data;
import swp391.com.backend.feature.examination.testResult.TestResultListDTO;
import swp391.com.backend.feature.examination.data.ExaminationStatus;


import java.time.LocalDate;
import java.util.List;

@Data
public class ExaminedExaminationDTO {
    private Long id;
    private List<TestResultListDTO> testResults;
    private LocalDate date;
    private String timeRange;
    private String customerName;
    private String staffName;
    private ExaminationStatus examinationStatus;
    private Long panelId;
}
