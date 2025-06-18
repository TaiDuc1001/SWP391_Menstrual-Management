package swp391.com.backend.feature.examination.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;


import java.time.LocalDate;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExaminationCreateResponse {
    Long id;
    LocalDate date;
    String timeRange;
}
