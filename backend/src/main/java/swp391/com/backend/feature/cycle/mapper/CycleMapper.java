package swp391.com.backend.feature.cycle.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.cycle.data.Cycle;
import swp391.com.backend.feature.cycle.dto.CycleDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CycleMapper {
    @Mapping(source = "customer.id", target = "customerId")
    CycleDTO toDTO(Cycle cycle);
    Cycle toEntity(CycleDTO cycleDTO);
    @Mapping(source = "customer.id", target = "customerId")
    List<CycleDTO> toDTOs(List<Cycle> cycles);
}
