package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.dto.ExaminationCreateResponse;
import swp391.com.backend.domain.dto.dto.ExaminationDTO;
import swp391.com.backend.domain.dto.simpledto.SimpleExaminationDTO;
import swp391.com.backend.jpa.pojo.examination.Examination;

@Mapper(componentModel = "spring")

public interface ExaminationMapper {
    @Mapping(target = "testResults", ignore = true)
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    ExaminationDTO toDTO(Examination entity);

    @Mapping(source = "panel.panelName", target = "panelName")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    @Mapping(source = "customer.name", target = "customerName")
    SimpleExaminationDTO toSimpleDTO(Examination entity);

    Examination toEntity(ExaminationDTO dto);

    @Mapping(source = "slot.timeRange", target = "timeRange")
    ExaminationCreateResponse toCreateResponse(Examination entity);
}

