package swp391.com.backend.feature.cycleSymptomByDate.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.cycleSymptomByDate.data.Symptom;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CycleSymptomByDateDTO {
    Long cycleId;
    LocalDate date;
    Symptom symptom;
}
