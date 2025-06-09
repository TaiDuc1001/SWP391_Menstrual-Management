package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.OrderDTO;
import swp391.com.backend.jpa.pojo.order.Order;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    Order toEntity(OrderDTO dto);
    OrderDTO toDto(Order entity);
}
