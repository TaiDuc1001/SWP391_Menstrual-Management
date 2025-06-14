package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.dto.ExaminationCreateResponse;
import swp391.com.backend.domain.dto.dto.ExaminedExaminationDTO;
import swp391.com.backend.domain.dto.dto.SampledExaminationDTO;
import swp391.com.backend.domain.dto.simpledto.SimpleExaminationDTO;
import swp391.com.backend.jpa.pojo.examination.Examination;

@Mapper(componentModel = "spring")

public interface ExaminationMapper {
    @Mapping(target = "testResults", ignore = true)
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    @Mapping(source = "staff.name", target = "staffName")
    ExaminedExaminationDTO toExaminedDTO(Examination entity);

    @Mapping(target = "testTypes", ignore = true)
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    @Mapping(source = "staff.name", target = "staffName")
    SampledExaminationDTO toSampledDTO(Examination entity);

    @Mapping(source = "panel.panelName", target = "panelName")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    @Mapping(source = "customer.name", target = "customerName")
    SimpleExaminationDTO toSimpleDTO(Examination entity);

    Examination toEntity(ExaminedExaminationDTO dto);

    @Mapping(source = "slot.timeRange", target = "timeRange")
    ExaminationCreateResponse toCreateResponse(Examination entity);
}

