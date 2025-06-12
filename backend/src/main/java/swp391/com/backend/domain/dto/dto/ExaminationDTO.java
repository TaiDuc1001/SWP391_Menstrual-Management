package swp391.com.backend.domain.dto.dto;

import lombok.Data;
import swp391.com.backend.jpa.pojo.schedule.Slot;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ExaminationDTO {
    private Long id;
    private List<TestResultListDTO> testResults;
    private LocalDate date;
    private Slot slot;
    private String customerName;
}
