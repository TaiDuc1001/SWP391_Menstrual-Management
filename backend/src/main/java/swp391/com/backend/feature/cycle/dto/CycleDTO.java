package swp391.com.backend.feature.cycle.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.cycleSymptomByDate.dto.CycleSymptomByDateDTO;

import java.time.LocalDate;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CycleDTO{
    Long id;
    LocalDate cycleStartDate;
    Integer cycleLength;
    Integer periodDuration;
    LocalDate ovulationDate;
    LocalDate fertilityWindowStart;
    LocalDate fertilityWindowEnd;
    List<CycleSymptomByDateDTO> cycleSymptomByDate;
}

