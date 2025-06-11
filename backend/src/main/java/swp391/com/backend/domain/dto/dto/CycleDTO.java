package swp391.com.backend.domain.dto.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CycleDTO{
    LocalDate cycleStartDate;
    Integer cycleLength;
    Integer periodDuration;
    LocalDate ovulationDate;
    LocalDate fertilityWindowStart;
    LocalDate fertilityWindowEnd;
}
