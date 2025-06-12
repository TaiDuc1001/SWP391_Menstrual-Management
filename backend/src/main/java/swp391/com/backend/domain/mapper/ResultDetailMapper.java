package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.dto.ResultDetailDTO;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;

@Mapper(componentModel = "spring")
public interface ResultDetailMapper {
    ResultDetailDTO toDTO(ResultDetail entity);
    ResultDetail toEntity(ResultDetailDTO dto);
}
