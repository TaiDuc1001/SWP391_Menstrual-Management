package swp391.com.backend.feature.panel.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.panel.dto.PanelDTO;
import swp391.com.backend.feature.panel.dto.SimplePanelDTO;
import swp391.com.backend.feature.panel.data.Panel;

@Mapper(componentModel = "spring")
public interface PanelMapper {
    SimplePanelDTO toSimpleDTO(Panel panel);
    @Mapping(target = "testTypesNames", ignore = true)
    @Mapping(target = "testTypesDescriptions", ignore = true)
    @Mapping(target = "testTypesNormalRanges", ignore = true)
    @Mapping(target = "testTypesUnits", ignore = true)
    @Mapping(target = "testTypesIds", ignore = true)
    PanelDTO toDTO(Panel entity);
    Panel toEntity(PanelDTO dto);
}
