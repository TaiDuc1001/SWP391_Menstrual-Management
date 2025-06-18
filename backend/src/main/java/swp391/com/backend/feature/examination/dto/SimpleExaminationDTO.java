package swp391.com.backend.feature.examination.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.examination.data.ExaminationStatus;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SimpleExaminationDTO {
    Long id;
    LocalDate date;
    String timeRange;
    ExaminationStatus examinationStatus;
    String panelName;
    String customerName;
}
