package swp391.com.backend.feature.customer.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.customer.dto.CustomerDTO;
import swp391.com.backend.feature.customer.data.Customer;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    CustomerDTO toDTO(Customer entity);
    Customer toEntity(CustomerDTO dto);
}
