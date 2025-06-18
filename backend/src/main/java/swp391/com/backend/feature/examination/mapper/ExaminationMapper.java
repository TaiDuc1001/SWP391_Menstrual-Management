package swp391.com.backend.feature.examination.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.examination.dto.ExaminationCreateResponse;
import swp391.com.backend.feature.examination.dto.ExaminedExaminationDTO;
import swp391.com.backend.feature.examination.dto.SampledExaminationDTO;
import swp391.com.backend.feature.examination.dto.SimpleExaminationDTO;
import swp391.com.backend.feature.examination.data.Examination;

@Mapper(componentModel = "spring")
public interface ExaminationMapper {
    @Mapping(target = "testResults", ignore = true)
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    @Mapping(source = "staff.name", target = "staffName")
    @Mapping(source = "panel.id", target = "panelId")
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

    @Mapping(source = "slot.timeRange", target = "timeRange")
    ExaminationCreateResponse toCreateResponse(Examination entity);

    Examination toEntity(ExaminedExaminationDTO dto);
}

