package swp391.com.backend.feature.cycleSymptomByDate.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.feature.cycleSymptomByDate.dto.CycleSymptomByDateDTO;
import swp391.com.backend.feature.cycleSymptomByDate.data.CycleSymptomByDate;

@Mapper(componentModel = "spring")
public interface CycleSymptomByDateMapper {
    CycleSymptomByDateDTO toDTO(CycleSymptomByDate cycleSymptomByDate);
    CycleSymptomByDate toEntity(CycleSymptomByDateDTO cycleSymptomByDateDTO);
}
