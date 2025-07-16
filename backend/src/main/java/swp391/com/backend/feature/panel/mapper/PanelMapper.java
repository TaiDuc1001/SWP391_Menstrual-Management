package swp391.com.backend.feature.panel.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.panel.dto.AdminPanelDTO;
import swp391.com.backend.feature.panel.dto.CreatePanelRequest;
import swp391.com.backend.feature.panel.dto.PanelDTO;
import swp391.com.backend.feature.panel.dto.SimplePanelDTO;
import swp391.com.backend.feature.panel.dto.UpdatePanelRequest;
import swp391.com.backend.feature.panel.data.Panel;

@Mapper(componentModel = "spring")
public interface PanelMapper {
    @Mapping(target = "testTypesNames", ignore = true)
    @Mapping(target = "testTypesDescriptions", ignore = true)
    SimplePanelDTO toSimpleDTO(Panel panel);
    
    @Mapping(target = "testTypesNames", ignore = true)
    @Mapping(target = "testTypesDescriptions", ignore = true)
    @Mapping(target = "testTypesNormalRanges", ignore = true)
    @Mapping(target = "testTypesUnits", ignore = true)
    @Mapping(target = "testTypesIds", ignore = true)
    PanelDTO toDTO(Panel entity);
    Panel toEntity(PanelDTO dto);

    @Mapping(target = "testTypes", ignore = true)
    AdminPanelDTO toAdminDTO(Panel panel);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "panelTestTypes", ignore = true)
    @Mapping(target = "examinations", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Panel fromCreateRequest(CreatePanelRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "panelTestTypes", ignore = true)
    @Mapping(target = "examinations", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Panel fromUpdateRequest(UpdatePanelRequest request);
}

