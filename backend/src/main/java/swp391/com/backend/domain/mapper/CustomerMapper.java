package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.dto.CustomerDTO;
import swp391.com.backend.jpa.pojo.roles.Customer;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    CustomerDTO toDTO(Customer entity);
    Customer toEntity(CustomerDTO dto);
}
