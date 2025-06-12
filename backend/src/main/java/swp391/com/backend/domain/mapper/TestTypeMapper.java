package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.dto.TestTypeDTO;
import swp391.com.backend.jpa.pojo.test.TestType;

@Mapper(componentModel = "spring")
public interface TestTypeMapper {
    TestTypeDTO toDTO(TestType entity);
    TestType toEntity(TestTypeDTO dto);


}
