package swp391.com.backend.feature.testType.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.testType.dto.TestTypeDTO;
import swp391.com.backend.feature.testType.data.TestType;

@Mapper(componentModel = "spring")
public interface TestTypeMapper {
    @Mapping(source = "id", target = "id")
    TestTypeDTO toDTO(TestType entity);
    TestType toEntity(TestTypeDTO dto);
}
