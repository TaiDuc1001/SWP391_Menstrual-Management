package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.dto.ExaminationDTO;
import swp391.com.backend.domain.dto.dto.SimpleExaminationDTO;
import swp391.com.backend.jpa.pojo.examination.Examination;

@Mapper(componentModel = "spring")
public interface ExaminationMapper {
    ExaminationDTO toDTO(Examination entity);
    SimpleExaminationDTO toSimpleDTO(Examination entity);
    Examination toEntity(ExaminationDTO dto);
}

