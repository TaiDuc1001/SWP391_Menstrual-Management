package swp391.com.backend.feature.cycle.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.hateoas.server.core.Relation;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Relation(collectionRelation = "cycles", itemRelation = "cycle")
public class CycleDTO{
    Long id;
    Long customerId;
    LocalDate cycleStartDate;
    Integer cycleLength;
    Integer periodDuration;
    LocalDate ovulationDate;
    LocalDate fertilityWindowStart;
    LocalDate fertilityWindowEnd;
}
