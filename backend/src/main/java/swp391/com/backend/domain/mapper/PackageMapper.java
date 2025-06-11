package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.PackageDTO;
import swp391.com.backend.jpa.pojo.test.Package;

@Mapper(componentModel = "spring")
public interface PackageMapper {
    PackageDTO toDTO(Package entity);
    Package toEntity(PackageDTO dto);
}
