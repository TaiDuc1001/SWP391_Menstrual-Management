package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.CustomerDTO;
import swp391.com.backend.jpa.pojo.roles.Customer;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    CustomerDTO toDTO(Customer entity);
    Customer toEntity(CustomerDTO dto);
}
