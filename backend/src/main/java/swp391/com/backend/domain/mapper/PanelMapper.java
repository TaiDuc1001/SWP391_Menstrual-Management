package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.dto.PanelDTO;
import swp391.com.backend.domain.dto.simpledto.SimplePanelDTO;
import swp391.com.backend.jpa.pojo.test.Panel;

@Mapper(componentModel = "spring")
public interface PanelMapper {
    SimplePanelDTO toSimpleDTO(Panel panel);
    @Mapping(target = "testTypesNames", ignore = true)
    @Mapping(target = "testTypesDescriptions", ignore = true)
    PanelDTO toDTO(Panel entity);
    Panel toEntity(PanelDTO dto);
}
