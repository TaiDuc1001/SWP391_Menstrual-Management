package swp391.com.backend.feature.examination.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.examination.dto.ExaminationCreateResponse;
import swp391.com.backend.feature.examination.dto.ExaminationDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExaminationMapper {
    @Mapping(source = "slot.timeRange", target = "timeRange")
    ExaminationCreateResponse toCreateResponse(Examination entity);

    Examination toEntity(ExaminationDTO dto);

    @Mapping(source = "panel.panelName", target = "panelName")
    @Mapping(source = "panel.id", target = "panelId")
    @Mapping(source = "result.id", target = "resultId")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "staff.id", target = "staffId")
    @Mapping(source = "staff.name", target = "staffName")
    ExaminationDTO toDTO(Examination entity);

    @Mapping(source = "panel.panelName", target = "panelName")
    @Mapping(source = "panel.id", target = "panelId")
    @Mapping(source = "result.id", target = "resultId")
    @Mapping(source = "slot.timeRange", target = "timeRange")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "staff.id", target = "staffId")
    @Mapping(source = "staff.name", target = "staffName")
    List<ExaminationDTO> toDTOs(List<Examination> entities);
}

