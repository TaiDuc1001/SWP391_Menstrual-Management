package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.dto.PackageDTO;
import swp391.com.backend.jpa.pojo.test.Panel;

@Mapper(componentModel = "spring")
public interface PackageMapper {
    PackageDTO toDTO(Panel entity);
    Panel toEntity(PackageDTO dto);
}
