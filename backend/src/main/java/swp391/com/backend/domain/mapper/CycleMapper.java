package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.CycleDTO;
import swp391.com.backend.jpa.pojo.cycle.Cycle;

@Mapper(componentModel = "spring")
public interface CycleMapper {
    CycleDTO toDTO(Cycle cycle);
    Cycle toEntity(CycleDTO cycleDTO);
}
