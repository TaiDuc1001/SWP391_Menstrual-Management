package swp391.com.backend.feature.cycle.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.feature.cycle.dto.CycleDTO;
import swp391.com.backend.feature.cycle.data.Cycle;

@Mapper(componentModel = "spring")
public interface CycleMapper {
    CycleDTO toDTO(Cycle cycle);
    Cycle toEntity(CycleDTO cycleDTO);
}
