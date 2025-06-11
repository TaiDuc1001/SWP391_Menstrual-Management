package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.CustomerDTO;
import swp391.com.backend.domain.dto.OrderDTO;
import swp391.com.backend.domain.dto.PackageDTO;
import swp391.com.backend.jpa.pojo.order.Order;

@Mapper(componentModel = "spring", uses = {CustomerMapper.class, PackageMapper.class})
public interface OrderMapper {
    @Mapping(target = "customer", source = "customer")
    @Mapping(target = "APackage", source = "APackage")
    OrderDTO toDTO(Order entity);
    Order toEntity(OrderDTO dto);
}
