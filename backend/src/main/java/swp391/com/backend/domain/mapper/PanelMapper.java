package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.dto.PanelDTO;
import swp391.com.backend.domain.dto.dto.SimplePanelDTO;
import swp391.com.backend.jpa.pojo.test.Panel;

@Mapper(componentModel = "spring")
public interface PanelMapper {
    SimplePanelDTO toSimpleDTO(Panel panel);
    PanelDTO toDTO(Panel entity);
    Panel toEntity(PanelDTO dto);
}
