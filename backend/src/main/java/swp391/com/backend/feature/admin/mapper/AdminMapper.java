package swp391.com.backend.feature.admin.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.feature.admin.data.Admin;
import swp391.com.backend.feature.admin.dto.AdminDTO;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    AdminDTO toDTO(Admin entity);
    Admin toEntity(AdminDTO dto);
}
