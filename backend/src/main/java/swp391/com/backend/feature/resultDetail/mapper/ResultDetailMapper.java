package swp391.com.backend.feature.resultDetail.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.feature.resultDetail.dto.ResultDetailDTO;
import swp391.com.backend.feature.resultDetail.data.ResultDetail;

@Mapper(componentModel = "spring")
public interface ResultDetailMapper {
    ResultDetailDTO toDTO(ResultDetail entity);
    ResultDetail toEntity(ResultDetailDTO dto);
}
