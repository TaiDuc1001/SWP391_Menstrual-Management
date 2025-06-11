package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.dto.OrderDTO;
import swp391.com.backend.jpa.pojo.order.Examination;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderDTO toDTO(Examination entity);
    Examination toEntity(OrderDTO dto);
}

