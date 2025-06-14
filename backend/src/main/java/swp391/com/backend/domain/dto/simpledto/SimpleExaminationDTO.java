package swp391.com.backend.domain.dto.simpledto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.jpa.pojo.examination.ExaminationStatus;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SimpleExaminationDTO {
    Long id;
    LocalDate date;
    String timeRange;
    ExaminationStatus examinationStatus;
    String panelName;
}
